import { useState } from "react";
import "./App.css";

function App() {
  const [level, setLevel] = useState(1);
  const [sql, setSql] = useState("");
  const [rows, setRows] = useState([]);
  const [correct, setCorrect] = useState(null);

  async function next() {
    const res = await fetch("http://localhost:5126/api/game/sql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, query: sql })
    });

    const data = await res.json();

    setRows(data.data || []);
    setCorrect(data.correct);

    if (data.correct) {
      setLevel(data.nextLevel);
      setSql("");
    }
  }

  return (
    <div className="game">
      <h1>⚔️ SQL Valhalla</h1>

      <div className="level">
        Level {level}
      </div>

      <textarea
        placeholder="Schreibe hier deine SQL-Abfrage..."
        value={sql}
        onChange={e => setSql(e.target.value)}
      />

      <button onClick={next}>
        Weiter →
      </button>

      {correct === true && <div className="success">✅ Richtig!</div>}
      {correct === false && <div className="error">❌ Noch nicht korrekt</div>}

      {rows.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(rows[0]).map(k => (
                <th key={k}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {Object.values(r).map((v, j) => (
                  <td key={j}>{String(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
