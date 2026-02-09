import { useEffect, useMemo, useState } from "react";
import "./App.css";

const sceneImages = {
  1: new URL("../../../img/kapitel1/szene1.png", import.meta.url).href,
  2: new URL("../../../img/kapitel1/szene2.png", import.meta.url).href,
  3: new URL("../../../img/kapitel1/szene3.png", import.meta.url).href,
  4: new URL("../../../img/kapitel1/szene4.png", import.meta.url).href,
  5: new URL("../../../img/kapitel1/szene5.png", import.meta.url).href,
  6: new URL("../../../img/kapitel1/szene6.png", import.meta.url).href,
  7: new URL("../../../img/kapitel1/szene7.png", import.meta.url).href
};

const fallbackScene = sceneImages[1];

const levelDefinitions = [
  {
    id: 1,
    title: "Überblick Dorfbewohner",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Zeig mir, wer sich gerade im Dorf aufhält. Wir müssen wissen, wer da ist.'",
    task: "Alle Bewohner, die aktuell im Dorf sind.",
    table: "dorfbewohner",
    selectColumns: ["*"],
    whereColumns: ["im_dorf"],
    valueOptions: {
      im_dorf: [{ label: "Im Dorf", value: 1, type: "number" }]
    }
  },
  {
    id: 2,
    title: "Vorräte Ställe",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Die Ställe Mayhren & Kohplan müssen gut gefüllt sein. Prüfe den Weizen.'",
    task: "Filtere Mayhren & Kohplan nach Weizen > 50.",
    table: "stall",
    selectColumns: ["name", "weizen_kg"],
    whereColumns: ["name", "weizen_kg"],
    valueOptions: {
      name: [
        { label: "Mayhren", value: "Mayhren", type: "string" },
        { label: "Kohplan", value: "Kohplan", type: "string" }
      ],
      weizen_kg: [
        { label: "50", value: 50, type: "number" },
        { label: "60", value: 60, type: "number" },
        { label: "70", value: 70, type: "number" }
      ]
    }
  },
  {
    id: 3,
    title: "Arbeitslose & unbesetzte Aufgaben",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Finde die Arbeitslosen, die noch keine Aufgabe haben. Sie müssen im Dorf sein.'",
    task: "Zeige arbeitslose Bewohner im Dorf (ohne Arbeit).",
    table: "dorfbewohner",
    selectColumns: ["id", "name", "age", "geschlecht"],
    whereColumns: ["arbeit", "im_dorf"],
    valueOptions: {
      im_dorf: [
        { label: "Im Dorf", value: 1, type: "number" },
        { label: "Nicht im Dorf", value: 0, type: "number" }
      ]
    }
  },
  {
    id: 4,
    title: "Unbesetzte Ställe",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Welche Ställe haben keinen Bearbeiter? Wir dürfen nichts verkommen lassen.'",
    task: "Zeige alle Ställe ohne Bearbeiter.",
    table: "stall",
    selectColumns: ["id", "name", "weizen_kg"],
    whereColumns: ["bearbeiter_id"],
    valueOptions: {}
  },
  {
    id: 5,
    title: "Schmied Grondolf Ressourcen",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Grondolf muss ausgerüstet sein. Prüfe seine Bestände.'",
    task: "Ressourcen des Schmieds Grondolf anzeigen.",
    table: "schmied",
    selectColumns: ["name", "eisen", "kohle", "holz"],
    whereColumns: ["name"],
    valueOptions: {
      name: [{ label: "Grondolf", value: "Grondolf", type: "string" }]
    }
  },
  {
    id: 6,
    title: "Wachposten",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Prüfe die Eingänge. Wer hält Wache am Nord- und West-Eingang?'",
    task: "Besetzte und unbesetzte Wachen anzeigen.",
    table: "wache",
    selectColumns: ["eingang", "wachposten_id"],
    whereColumns: [],
    valueOptions: {}
  },
  {
    id: 7,
    title: "Nachwuchs & Ausbildung",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Wer ist in Ausbildung? Wir müssen unseren Nachwuchs kennen.'",
    task: "Filter Alter >=16 und Ausbildungsstatus.",
    table: "dorfbewohner",
    selectColumns: ["id", "name", "age"],
    whereColumns: ["in_ausbildung", "age"],
    valueOptions: {
      in_ausbildung: [
        { label: "In Ausbildung", value: 1, type: "number" },
        { label: "Nicht in Ausbildung", value: 0, type: "number" }
      ],
      age: [
        { label: "16", value: 16, type: "number" },
        { label: "18", value: 18, type: "number" },
        { label: "20", value: 20, type: "number" }
      ]
    }
  },
  {
    id: 8,
    title: "Regionen & Dörfer",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Gib mir eine Liste aller Dörfer der Region, mit ihren Anführern.'",
    task: "Liste Dörfer + Leader, sortiert nach Entfernung.",
    table: "doerfer",
    selectColumns: ["name", "anfuehrer", "freundlich"],
    whereColumns: [],
    valueOptions: {},
    orderBy: {
      required: true,
      columns: ["entfernung_km"],
      defaultColumn: "entfernung_km",
      defaultDirection: "ASC"
    }
  },
  {
    id: 9,
    title: "Raubzug Ziel finden",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Suche ein Dorf, das schwach genug und nah genug ist.'",
    task:
      "Filter: Bewohner < 1000, Distanz <= 50km, optional weitere Bedingungen.",
    table: "doerfer",
    selectColumns: ["name", "anzahl_bewohner", "entfernung_km", "anfuehrer"],
    whereColumns: ["anzahl_bewohner", "entfernung_km", "freundlich"],
    valueOptions: {
      anzahl_bewohner: [
        { label: "1000", value: 1000, type: "number" },
        { label: "500", value: 500, type: "number" }
      ],
      entfernung_km: [
        { label: "50", value: 50, type: "number" },
        { label: "30", value: 30, type: "number" }
      ],
      freundlich: [
        { label: "Nein", value: 0, type: "number" },
        { label: "Ja", value: 1, type: "number" }
      ]
    }
  },
  {
    id: 10,
    title: "Kapitelabschluss",
    chapter: "Kapitel 1",
    story:
      "Vater: 'Gut gemacht. Kapitel 1 ist abgeschlossen. Bereite dich auf die nächste Reise vor.'",
    task: "Endscreen Kapitel 1 abgeschlossen + Button zu Kapitel 2."
  }
];

const operatorOptions = ["=", "!=", "<", ">", "<=", ">=", "LIKE", "IS NULL"];
const connectorOptions = ["AND", "OR"];

const progressKey = "sql-valhalla-progress";

const tableSamples = {
  users: {
    columns: ["id", "username", "pounds", "created"],
    rows: [
      { id: 1, username: "Ragnar", pounds: 214, created: "2024-01-05" },
      { id: 2, username: "Bjorn", pounds: 195, created: "2024-01-08" },
      { id: 3, username: "Freya", pounds: 247, created: "2024-01-12" },
      { id: 4, username: "Erik", pounds: 189, created: "2024-01-15" },
      { id: 5, username: "Astrid", pounds: 203, created: "2024-01-18" }
    ]
  },
  orders: {
    columns: ["id", "user_id", "amount", "status", "order_date"],
    rows: [
      { id: 101, user_id: 1, amount: 320, status: "paid", order_date: "2024-02-01" },
      { id: 102, user_id: 2, amount: 120, status: "open", order_date: "2024-02-03" },
      { id: 103, user_id: 4, amount: 560, status: "paid", order_date: "2024-02-05" }
    ]
  },
  products: {
    columns: ["id", "name", "category", "price", "stock"],
    rows: [
      { id: 501, name: "Langschwert", category: "Waffen", price: 120, stock: 14 },
      { id: 502, name: "Schild", category: "Rüstung", price: 90, stock: 22 },
      { id: 503, name: "Heiltrank", category: "Alchemie", price: 35, stock: 64 }
    ]
  }
};

const emptyCondition = (column = "", operator = "=", value = "", connector = "AND") => ({
  column,
  operator,
  value,
  connector
});

const buildSql = (level, builder) => {
  if (!level || !builder) return "";
  const selectedColumns = builder.selectAll
    ? "*"
    : builder.selectedColumns.length
      ? builder.selectedColumns.join(", ")
      : "*";

  const parts = [`SELECT ${selectedColumns}`, `FROM ${builder.table}`];

  if (builder.conditions.length > 0) {
    const whereParts = builder.conditions
      .filter((condition) => condition.column && condition.operator)
      .map((condition, index) => {
        const prefix = index === 0 ? "" : `${condition.connector} `;
        if (condition.operator === "IS NULL") {
          return `${prefix}${condition.column} IS NULL`;
        }
        if (!condition.value && condition.value !== 0) {
          return `${prefix}${condition.column} ${condition.operator}`;
        }
        const valueOption =
          level.valueOptions?.[condition.column]?.find(
            (option) => String(option.value) === String(condition.value)
          ) ?? null;
        const formattedValue =
          valueOption?.type === "string"
            ? `'${valueOption.value}'`
            : valueOption?.type === "number"
              ? valueOption.value
              : condition.value;
        return `${prefix}${condition.column} ${condition.operator} ${formattedValue}`;
      });

    if (whereParts.length > 0) {
      parts.push(`WHERE ${whereParts.join(" ")}`);
    }
  }

  if (builder.orderBy?.active && builder.orderBy.column) {
    parts.push(`ORDER BY ${builder.orderBy.column} ${builder.orderBy.direction}`);
  }

  if (builder.limit) {
    parts.push(`LIMIT ${builder.limit}`);
  }

  return `${parts.join(" ")};`;
};

const createBuilderState = (level) => {
  if (!level) return null;
  const hasSelectAll = level.selectColumns?.includes("*");
  return {
    table: level.table,
    selectAll: hasSelectAll,
    selectedColumns: hasSelectAll
      ? []
      : Array.isArray(level.selectColumns)
        ? level.selectColumns
        : [],
    conditions: [],
    orderBy: level.orderBy
      ? {
          active: Boolean(level.orderBy.required),
          column: level.orderBy.defaultColumn,
          direction: level.orderBy.defaultDirection
        }
      : null,
    limit: ""
  };
};

const createBuilderFallback = (level) => ({
  table: level?.table ?? "",
  selectAll: false,
  selectedColumns: [],
  conditions: [],
  orderBy: null,
  limit: ""
});

const getSceneForLevel = (levelId) => sceneImages[levelId] ?? fallbackScene;

const ResultTable = ({ rows }) => {
  if (!rows || rows.length === 0) return null;
  const headers = Object.keys(rows[0]);
  return (
    <table className="result-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header) => (
              <td key={`${rowIndex}-${header}`}>{String(row[header])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function App() {
  const [view, setView] = useState("home");
  const [activeLevelId, setActiveLevelId] = useState(null);
  const [builder, setBuilder] = useState(null);
  const [rows, setRows] = useState([]);
  const [activeTable, setActiveTable] = useState("users");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(progressKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        return { unlockedLevel: 1, completed: [] };
      }
    }
    return { unlockedLevel: 1, completed: [] };
  });

  const activeLevel = useMemo(
    () => levelDefinitions.find((level) => level.id === activeLevelId),
    [activeLevelId]
  );
  const completedCount = progress.completed.length;
  const totalLevels = levelDefinitions.length;
  const earnedXp = completedCount * 25;
  const totalXp = totalLevels * 25;
  const playerLevel = Math.max(1, Math.floor(earnedXp / 100) + 1);

  const sqlPreview = useMemo(() => {
    if (!activeLevel) return "";
    return buildSql(activeLevel, builder ?? createBuilderFallback(activeLevel));
  }, [activeLevel, builder]);

  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (!activeLevel) return;
    setBuilder(createBuilderState(activeLevel));
    setRows([]);
    setFeedback(null);
  }, [activeLevel]);

  const isUnlocked = (levelId) => levelId <= progress.unlockedLevel;

  const updateProgress = (levelId) => {
    setProgress((prev) => {
      const completed = prev.completed.includes(levelId)
        ? prev.completed
        : [...prev.completed, levelId];
      const unlockedLevel = Math.max(prev.unlockedLevel, levelId + 1);
      return { completed, unlockedLevel };
    });
  };

  const handleCheck = async () => {
    if (!activeLevel || !builder) return;
    if (activeLevel.id === 10) return;

    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/game/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: activeLevel.id, query: sqlPreview })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Fehler beim Prüfen der Abfrage");
      }

      const data = await response.json();
      setRows(data.data || []);
      setFeedback(data.correct ? "✅ Richtig!" : "❌ Noch nicht korrekt");

      if (data.correct) {
        updateProgress(activeLevel.id);
        if (data.nextLevel) {
          setActiveLevelId(data.nextLevel);
        }
      }
    } catch (error) {
      setFeedback(`⚠️ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChapter = () => {
    updateProgress(10);
  };

  const handleSelectLevel = (levelId) => {
    if (!isUnlocked(levelId)) return;
    setActiveLevelId(levelId);
    setView("level");
  };

  const handleAddCondition = () => {
    if (!activeLevel || !builder) return;
    const defaultColumn = activeLevel.whereColumns?.[0] ?? "";
    setBuilder((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        emptyCondition(defaultColumn, "=", "", "AND")
      ]
    }));
  };

  const handleConditionChange = (index, field, value) => {
    setBuilder((prev) => {
      const nextConditions = prev.conditions.map((condition, idx) =>
        idx === index ? { ...condition, [field]: value } : condition
      );
      return { ...prev, conditions: nextConditions };
    });
  };

  const handleRemoveCondition = (index) => {
    setBuilder((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, idx) => idx !== index)
    }));
  };

  if (view === "home") {
    return (
      <div className="app">
        <header className="hero">
          <p className="hero-kicker">SQL lernen war noch nie so spielerisch</p>
          <h1>SQL Valhalla</h1>
          <p className="hero-subtitle">
            Stelle dich den Missionen, verbessere deine SQL-Kenntnisse und führe
            dein Dorf zu Ruhm und Ehre.
          </p>
        </header>

        <section className="home-grid">
          <article className="home-card home-card--info">
            <div className="home-badge">⚔️ SQL Valhalla</div>
            <div className="home-emblem">🛡️</div>
            <h2>Das Training der Krieger</h2>
            <p>
              Begleite deinen Vater durch Kapitel 1 und lerne SQL über echte
              Aufgaben aus dem Alltag des Dorfes.
            </p>
            <div className="home-meta">
              <span>{completedCount} / {totalLevels} Missionen geschafft</span>
              <span>{earnedXp} XP gesammelt</span>
            </div>
          </article>

          <article className="home-card home-card--actions">
            <h2>Bereit für den Kampf?</h2>
            <button className="primary" onClick={() => setView("missions")}>
              Spielen
            </button>
            <div className="home-actions">
              <button className="ghost">Statistiken</button>
              <button className="ghost">Einstellungen</button>
            </div>
            <div className="home-stats">
              <div>
                <strong>{totalLevels}</strong>
                <span>Quests</span>
              </div>
              <div>
                <strong>{earnedXp}</strong>
                <span>XP</span>
              </div>
              <div>
                <strong>{playerLevel}</strong>
                <span>Level</span>
              </div>
            </div>
          </article>
        </section>
      </div>
    );
  }

  if (view === "missions" && !activeLevel) {
    return (
      <div className="app">
        <nav className="top-nav">
          <button className="ghost" onClick={() => setView("home")}>
            🏠 Hauptmenü
          </button>
          <button className="ghost active">⚔️ Missionen</button>
          <div className="nav-meta">
            <span className="pill">💰 {earnedXp}</span>
            <span className="pill">⭐ {earnedXp} XP</span>
          </div>
        </nav>
        <header className="missions-hero">
          <h1>🗡️ Missionen & Quests</h1>
          <p>Wähle deine nächste Herausforderung in Kapitel 1.</p>
        </header>
        <section className="mission-grid">
          {levelDefinitions.map((level) => {
            const isCompleted = progress.completed.includes(level.id);
            const locked = !isUnlocked(level.id);
            return (
              <button
                key={level.id}
                className={`mission-card ${locked ? "locked" : ""}`}
                onClick={() => handleSelectLevel(level.id)}
                disabled={locked}
              >
                <div className="mission-card__header">
                  <span className="mission-level">Level {level.id}</span>
                  <span className={`mission-status ${isCompleted ? "done" : ""}`}>
                    {isCompleted ? "✓ Abgeschlossen" : locked ? "🔒 Gesperrt" : "🗡️ Offen"}
                  </span>
                </div>
                <h3>{level.title}</h3>
                <p>{level.task}</p>
                <div className="mission-tags">
                  <span>Kapitel 1</span>
                  <span>+25 XP</span>
                </div>
              </button>
            );
          })}
        </section>
      </div>
    );
  }

  if (!activeLevel) {
    return null;
  }

  if (activeLevel.id === 10) {
    return (
      <div className="app">
        <nav className="top-nav">
          <button
            className="ghost"
            onClick={() => {
              setActiveLevelId(null);
              setView("missions");
            }}
          >
            ← Missionen
          </button>
          <button className="ghost" onClick={() => setView("home")}>
            🏠 Hauptmenü
          </button>
          <div className="nav-meta">
            <span className="pill">⭐ {earnedXp} XP</span>
          </div>
        </nav>
        <section className="level-screen">
          <img
            className="scene-image"
            src={getSceneForLevel(activeLevel.id)}
            alt={`Szene Level ${activeLevel.id}`}
            onError={(event) => {
              event.currentTarget.src = fallbackScene;
            }}
          />
          <div className="level-header">
            <div>
              <span className="chapter">{activeLevel.chapter}</span>
              <h2>Level {activeLevel.id}: {activeLevel.title}</h2>
            </div>
          </div>
          <div className="story-box">
            <p>{activeLevel.story}</p>
          </div>
          <div className="task-box">
            <strong>Aufgabe:</strong>
            <p>{activeLevel.task}</p>
          </div>
          <div className="completion-box">
            <p>
              Kapitel 1 abgeschlossen! Du bist bereit für die nächsten Abenteuer.
            </p>
            <button onClick={handleCompleteChapter}>
              Kapitel 2 freischalten
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app level-app">
      <nav className="top-nav">
        <button
          className="ghost"
          onClick={() => {
            setActiveLevelId(null);
            setView("missions");
          }}
        >
          ← Missionen
        </button>
        <button className="ghost" onClick={() => setView("home")}>
          🏠 Hauptmenü
        </button>
        <div className="nav-meta">
          <span className="pill">💰 {earnedXp}</span>
          <span className="pill">⭐ {earnedXp} XP</span>
        </div>
      </nav>

      <header className="level-hero">
        <div>
          <p className="level-hero__kicker">SQL Valhalla Training</p>
          <h2>Mission: {activeLevel.title}</h2>
        </div>
        <div className="hero-actions">
          <button className="primary">💡 Tip</button>
          <button className="ghost">🗺️ ER Diagram</button>
        </div>
      </header>

      <div className="level-layout">
        <aside className="sidebar">
          <div className="sidebar-card">
            <h3>📊 Datenbank Tabellen</h3>
            <div className="tab-row">
              {Object.keys(tableSamples).map((tableKey) => (
                <button
                  key={tableKey}
                  className={`tab ${activeTable === tableKey ? "active" : ""}`}
                  onClick={() => setActiveTable(tableKey)}
                >
                  {tableKey}
                </button>
              ))}
            </div>
            <div className="table-preview">
              <p className="table-title">Tabelle: {activeTable}</p>
              <table>
                <thead>
                  <tr>
                    {tableSamples[activeTable].columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableSamples[activeTable].rows.map((row, rowIndex) => (
                    <tr key={`${activeTable}-row-${rowIndex}`}>
                      {tableSamples[activeTable].columns.map((column) => (
                        <td key={`${activeTable}-${rowIndex}-${column}`}>
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </aside>

        <section className="level-screen content">
          <img
            className="scene-image"
            src={getSceneForLevel(activeLevel.id)}
            alt={`Szene Level ${activeLevel.id}`}
            onError={(event) => {
              event.currentTarget.src = fallbackScene;
            }}
          />
          <div className="level-header">
            <div>
              <span className="chapter">{activeLevel.chapter}</span>
              <h2>Level {activeLevel.id}: {activeLevel.title}</h2>
            </div>
            <div className="progress-pill">
              Freigeschaltet bis Level {progress.unlockedLevel}
            </div>
          </div>
          <div className="story-box dialogue-card">
            <div className="dialogue-avatar">🛡️</div>
            <div>
              <p className="dialogue-name">Bjorn der Schmied sagt:</p>
              <p>{activeLevel.story}</p>
            </div>
          </div>
          <div className="task-box">
            <strong>Aufgabe</strong>
            <p>{activeLevel.task}</p>
          </div>

          <div className="builder">
            <h3>Query-Builder</h3>
            <div className="builder-section">
              <span className="builder-label">SELECT</span>
              <div className="builder-options">
                {builder?.selectAll !== undefined && (
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={builder.selectAll}
                      onChange={(event) =>
                        setBuilder((prev) => ({
                          ...prev,
                          selectAll: event.target.checked,
                          selectedColumns: []
                        }))
                      }
                    />
                    Alle Spalten (*)
                  </label>
                )}
                {!builder?.selectAll &&
                  activeLevel.selectColumns
                    ?.filter((column) => column !== "*")
                    .map((column) => (
                      <label key={column} className="checkbox">
                        <input
                          type="checkbox"
                          checked={builder.selectedColumns.includes(column)}
                          onChange={(event) => {
                            const selected = event.target.checked;
                            setBuilder((prev) => {
                              const next = selected
                                ? [...prev.selectedColumns, column]
                                : prev.selectedColumns.filter(
                                    (value) => value !== column
                                  );
                              return { ...prev, selectedColumns: next };
                            });
                          }}
                        />
                        {column}
                      </label>
                    ))}
              </div>
            </div>

            <div className="builder-section">
              <span className="builder-label">FROM</span>
              <div className="builder-options">
                <select
                  value={builder?.table ?? ""}
                  onChange={(event) =>
                    setBuilder((prev) => ({ ...prev, table: event.target.value }))
                  }
                >
                  <option value={activeLevel.table}>{activeLevel.table}</option>
                </select>
              </div>
            </div>

            <div className="builder-section">
              <div className="builder-header">
                <span className="builder-label">WHERE</span>
                {activeLevel.whereColumns?.length > 0 && (
                  <button className="ghost" onClick={handleAddCondition}>
                    + Filter hinzufügen
                  </button>
                )}
              </div>
              {activeLevel.whereColumns?.length === 0 && (
                <p className="helper-text">
                  Für dieses Level sind keine Filter notwendig.
                </p>
              )}
              {builder?.conditions.map((condition, index) => (
                <div key={`condition-${index}`} className="condition-row">
                  {index > 0 && (
                    <select
                      value={condition.connector}
                      onChange={(event) =>
                        handleConditionChange(
                          index,
                          "connector",
                          event.target.value
                        )
                      }
                    >
                      {connectorOptions.map((connector) => (
                        <option key={connector} value={connector}>
                          {connector}
                        </option>
                      ))}
                    </select>
                  )}
                  <select
                    value={condition.column}
                    onChange={(event) =>
                      handleConditionChange(
                        index,
                        "column",
                        event.target.value
                      )
                    }
                  >
                    {activeLevel.whereColumns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(event) =>
                      handleConditionChange(
                        index,
                        "operator",
                        event.target.value
                      )
                    }
                  >
                    {operatorOptions.map((operator) => (
                      <option key={operator} value={operator}>
                        {operator}
                      </option>
                    ))}
                  </select>
                  {condition.operator !== "IS NULL" && (
                    <select
                      value={condition.value}
                      onChange={(event) =>
                        handleConditionChange(index, "value", event.target.value)
                      }
                    >
                      <option value="">Wert wählen</option>
                      {(activeLevel.valueOptions?.[condition.column] ?? []).map(
                        (option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  )}
                  <button
                    className="ghost"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>

            {activeLevel.orderBy && (
              <div className="builder-section">
                <span className="builder-label">ORDER BY</span>
                <div className="builder-options">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={builder?.orderBy?.active ?? false}
                      disabled={activeLevel.orderBy.required}
                      onChange={(event) =>
                        setBuilder((prev) => ({
                          ...prev,
                          orderBy: {
                            ...prev.orderBy,
                            active: event.target.checked
                          }
                        }))
                      }
                    />
                    Sortierung aktivieren
                  </label>
                  <select
                    value={builder?.orderBy?.column ?? ""}
                    onChange={(event) =>
                      setBuilder((prev) => ({
                        ...prev,
                        orderBy: { ...prev.orderBy, column: event.target.value }
                      }))
                    }
                  >
                    {activeLevel.orderBy.columns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                  <select
                    value={builder?.orderBy?.direction ?? "ASC"}
                    onChange={(event) =>
                      setBuilder((prev) => ({
                        ...prev,
                        orderBy: {
                          ...prev.orderBy,
                          direction: event.target.value
                        }
                      }))
                    }
                  >
                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="preview">
            <div className="preview-header">
              <h3>Live SQL Preview</h3>
              <span className="muted">Nur Lesen</span>
            </div>
            <pre>{sqlPreview}</pre>
            <button onClick={handleCheck} disabled={loading}>
              {loading ? "Prüfe..." : "Abfrage prüfen"}
            </button>
            {feedback && <div className="feedback">{feedback}</div>}
          </div>

          <div className="result">
            <h3>Ergebnis-Preview</h3>
            <ResultTable rows={rows} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
