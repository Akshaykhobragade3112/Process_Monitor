# Process Monitor Assignment

This project is a **system process monitoring solution** built with:

- **Python Agent** → Collects system & process information from the host machine.  
- **Django Backend (API)** → Provides REST API to fetch system and process details.  
- **React Frontend (Vite + React)** → Displays system details & running processes in an interactive UI.  

---

##  Features

- Fetch **System Information**: Hostname, OS, Processor, RAM, Storage, etc.  
- Fetch **Running Processes**: PID, PPID, Memory Usage, CPU Usage.  
- Process Tree view (hierarchical representation with expandable nodes).  
- User-friendly **dashboard** with dark theme.  
- **Modular structure** with Agent + Backend + Frontend separation.  

---

##  Setup Instructions

Follow these steps to run the project:

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/process-monitor-assignment.git
cd process-monitor-assignment
```

### 2. Setup Agent

The Agent fetches system and running processes information.
```bash
cd agent
pip install -r requirements.txt
python -m PyInstaller --onefile agent.py
```

The agent pushes system/process info that can be consumed by the backend.

### 3. Setup Backend (Django)
```bash
cd process_moniter
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API will be available at:
 http://127.0.0.1:8000/process_monitor/

 Sample API Response:
```
{
  "system_info": {
    "hostname": "DESKTOP-123ABC",
    "os": "Windows 10",
    "processor": "Intel Core i5",
    "number_of_cores": 4,
    "number_of_threads": 8,
    "ram_gb": 16,
    "used_ram_gb": 7.5,
    "available_ram_gb": 8.5,
    "total_storage_gb": 512,
    "used_storage_gb": 300,
    "free_storage_gb": 212
  },
  "running_processes": [
    {
      "name": "chrome.exe",
      "pid": 1234,
      "ppid": 432,
      "memory_mb": 200,
      "cpu_percent": 5.3
    }
  ]
}
```

### 4. Setup Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:
 http://localhost:5173/

## Frontend UI

Header → Process Monitor

Sidebar → Hostname + Tabs (System Details, Process Details)

System Details → Table view of host machine details

Process Details → Expandable tree view of running processes

---
## Tech Stack

Agent: Python, psutil, subprocess

Backend: Django, Django REST Framework

Frontend: React, Vite, Axios
