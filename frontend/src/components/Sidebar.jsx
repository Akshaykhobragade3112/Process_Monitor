export default function Sidebar({ tab, setTab }) {
  return (
    <div style={{ width: "220px", background: "#f44336", color: "white" }}>
      <h2 style={{ padding: "1rem", textAlign: "center" }}>Process Monitor</h2>
      <button
        onClick={() => setTab("system")}
        style={{
          width: "100%",
          padding: "12px",
          background: tab === "system" ? "#fff" : "#f44336",
          color: tab === "system" ? "#000" : "#fff",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        System Details
      </button>
      <button
        onClick={() => setTab("process")}
        style={{
          width: "100%",
          padding: "12px",
          background: tab === "process" ? "#fff" : "#f44336",
          color: tab === "process" ? "#000" : "#fff",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        Processes Details
      </button>
    </div>
  );
}
