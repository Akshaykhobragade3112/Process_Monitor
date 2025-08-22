import { useEffect, useState } from "react";
import axios from "axios";

export default function SystemDetails() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/process_monitor/")
      .then(res => setInfo(res.data.system_info))
      .catch(err => console.error(err));
  }, []);

  if (!info) return <p>Loading...</p>;

  const rows = [
    ["Name", info.hostname],
    ["Operating System", info.os],
    ["Processor", info.processor],
    ["Number of Cores", info.number_of_cores],
    ["Number of Threads", info.number_of_threads],
    ["RAM (GB)", info.ram_gb],
    ["Used RAM (GB)", info.used_ram_gb],
    ["Available RAM (GB)", info.available_ram_gb],
    ["Storage Free (GB)", info.free_storage_gb],
    ["Storage Total (GB)", info.total_storage_gb],
    ["Storage Used (GB)", info.used_storage_gb],
  ];

  return (
    <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td style={{ fontWeight: "bold" }}>{label}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
