import { useState, useEffect } from "react";
import SystemDetails from "./components/SystemDetails";
import ProcessTree from "./components/ProcessTree";

function App() {
  const [tab, setTab] = useState("system");
  const [hostData, setHostData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/process_monitor/") // your API
      .then((res) => res.json())
      .then((data) => setHostData(data.system_info))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      style={{
        fontFamily: "Segoe UI, sans-serif",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          background: "linear-gradient(90deg, #1976d2, #1565c0)",
          color: "white",
          padding: "1rem",
          fontSize: "26px",
          fontWeight: "bold",
          letterSpacing: "1px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        Process Monitor
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "240px",
            background: "#f8f9fa",
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            paddingTop: "1rem",
          }}
        >
          {/* Hostname first */}
          <div
            style={{
              margin: "0 1rem 1.2rem 1rem",
              padding: "12px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "8px",
              background: "#da3f2bff",
              color: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            {hostData?.hostname || "Loading..."}
          </div>

          {/* Tabs */}
          <button
            onClick={() => setTab("system")}
            style={{
              margin: "0.3rem 1rem",
              padding: "12px",
              background: tab === "system" ? "#1976d2" : "#ffffff",
              color: tab === "system" ? "#fff" : "#333",
              border: "1px solid #1976d2",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.3s",
            }}
          >
            System Details
          </button>

          <button
            onClick={() => setTab("process")}
            style={{
              margin: "0.3rem 1rem",
              padding: "12px",
              background: tab === "process" ? "#1976d2" : "#ffffff",
              color: tab === "process" ? "#fff" : "#333",
              border: "1px solid #1976d2",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.3s",
            }}
          >
            Processes Details
          </button>
        </div>

        {/* Right Content */}
        <div
          style={{
            flex: 1,
            padding: "1.5rem",
            overflowY: "auto",
            background: "#121212", // dark theme background
            color: "#e0e0e0",
          }}
        >
          {tab === "system" ? <SystemDetails /> : <ProcessTree />}
        </div>
      </div>
    </div>
  );
}

export default App;
