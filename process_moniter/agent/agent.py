import platform
import psutil
import subprocess
import json
import re


def get_running_processes():
    """
    Fetch running processes using Windows 'tasklist' + psutil for CPU% and PPID.
    """
    processes = []
    system_processes = []

    try:
        # Run tasklist and capture output
        output = subprocess.check_output(["tasklist"], shell=True, text=True)
        lines = output.splitlines()[3:]  # skip header rows

        for line in lines:
            parts = re.split(r"\s+", line.strip())
            if len(parts) >= 5:
                process_name = parts[0]

                # Some system processes (Registry, Memory Compression) don’t have numeric PIDs
                try:
                    pid = int(parts[1])
                except ValueError:
                    system_processes.append(process_name)
                    continue

                # Memory usage (convert KB → MB)
                mem_usage_mb = 0.0
                try:
                    mem_usage_str = parts[-2].replace(",", "").replace("K", "")
                    mem_usage_mb = round(int(mem_usage_str) / 1024, 2)
                except Exception:
                    pass

                # CPU usage + PPID
                cpu_percent = 0.0
                ppid = None
                try:
                    p = psutil.Process(pid)
                    cpu_percent = p.cpu_percent(interval=0.1)
                    ppid = p.ppid()   # 👈 added parent PID
                except Exception:
                    pass

                processes.append({
                    "name": process_name,
                    "pid": pid,
                    "ppid": ppid,             # 👈 new field
                    "memory_mb": mem_usage_mb,
                    "cpu_percent": cpu_percent
                })

    except Exception as e:
        processes.append({"error": str(e)})

    return processes, system_processes


def get_system_info(system_processes):
    """
    Gather system-level information using psutil and platform.
    """
    hostname = platform.node()
    os_info = platform.system() + " " + platform.release()
    processor = platform.processor()
    cores = psutil.cpu_count(logical=False)
    threads = psutil.cpu_count(logical=True)

    svmem = psutil.virtual_memory()
    ram_total = round(svmem.total / (1024 ** 3), 2)
    ram_used = round(svmem.used / (1024 ** 3), 2)
    ram_available = round(svmem.available / (1024 ** 3), 2)

    disk = psutil.disk_usage("C:\\")
    storage_total = round(disk.total / (1024 ** 3), 2)
    storage_used = round(disk.used / (1024 ** 3), 2)
    storage_free = round(disk.free / (1024 ** 3), 2)

    return {
        "hostname": hostname,
        "os": os_info,
        "processor": processor,
        "number_of_cores": cores,
        "number_of_threads": threads,
        "ram_gb": ram_total,
        "used_ram_gb": ram_used,
        "available_ram_gb": ram_available,
        "total_storage_gb": storage_total,
        "used_storage_gb": storage_used,
        "free_storage_gb": storage_free,
        "system_processes": system_processes  # 👈 added here
    }

def print_process_tree(json_file="system_info.json"):
    """
    Read system_info.json and print processes in a parent-child tree format.
    """
    with open(json_file, "r") as f:
        data = json.load(f)

    processes = data.get("running_processes", [])

    # Build a dict: pid -> process info
    proc_map = {p["pid"]: p for p in processes if "pid" in p}

    # Build children map: ppid -> [children]
    children = {}
    for p in processes:
        ppid = p.get("ppid")
        if ppid not in children:
            children[ppid] = []
        children[ppid].append(p)

    def print_tree(pid, level=0):
        proc = proc_map.get(pid)
        if not proc:
            return
        indent = "  " * level
        print(f"{indent}- {proc['name']} (PID: {proc['pid']}, CPU: {proc['cpu_percent']}%, MEM: {proc['memory_mb']}MB)")
        for child in children.get(pid, []):
            print_tree(child["pid"], level + 1)

    # Start from top-level processes (those whose PPID not in proc_map)
    for p in processes:
        if p.get("ppid") not in proc_map:
            print_tree(p["pid"], 0)


if __name__ == "__main__":
    running_processes, system_processes = get_running_processes()

    data = {
        "system_info": get_system_info(system_processes),
        "running_processes": running_processes
    }

    with open("system_info.json", "w") as f:
        json.dump(data, f, indent=4)

    print(json.dumps(data, indent=4))
