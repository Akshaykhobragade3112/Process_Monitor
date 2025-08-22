import { useEffect, useState } from "react";
import axios from "axios";

function buildTree(processes) {
  const map = {};
  processes.forEach(p => { map[p.pid] = { ...p, children: [] }; });
  const roots = [];
  processes.forEach(p => {
    if (p.ppid && map[p.ppid]) {
      map[p.ppid].children.push(map[p.pid]);
    } else {
      roots.push(map[p.pid]);
    }
  });
  return roots;
}

function ProcessNode({ node, level = 0 }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr>
        <td style={{ paddingLeft: level * 20 }}>
          {node.children.length > 0 && (
            <button onClick={() => setOpen(!open)} style={{ marginRight: "5px" }}>
              {open ? "-" : "+"}
            </button>
          )}
          {node.name}
        </td>
        <td>{node.memory_mb}</td>
        <td>{node.cpu_percent}</td>
        <td>{node.ppid}</td>
      </tr>
      {open && node.children.map(child => (
        <ProcessNode key={child.pid} node={child} level={level + 1} />
      ))}
    </>
  );
}

export default function ProcessTree() {
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/process_monitor/")
      .then(res => setProcesses(res.data.running_processes))
      .catch(err => console.error(err));
  }, []);

  if (!processes.length) return <p>Loading...</p>;

  const roots = buildTree(processes);

  return (
    <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Memory Usage (MB)</th>
          <th>CPU Usage (%)</th>
          <th>PPID</th>
        </tr>
      </thead>
      <tbody>
        {roots.map(root => (
          <ProcessNode key={root.pid} node={root} />
        ))}
      </tbody>
    </table>
  );
}
