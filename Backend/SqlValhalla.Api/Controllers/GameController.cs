using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using SqlValhalla.Api.Models;

namespace SqlValhalla.Api.Controllers
{
    [ApiController]
    [Route("api/game")]
    public class GameController : ControllerBase
    {
        private readonly IConfiguration _config;

        public GameController(IConfiguration config)
        {
            _config = config;
        }

        // =========================
        // LEVEL-DEFINITIONEN
        // =========================
        private static readonly Dictionary<int, string> Levels = new()
        {
            { 1, "SELECT * FROM dorfbewohner WHERE im_dorf = 1;" },

            { 2, @"SELECT name, weizen_kg
                   FROM stall
                   WHERE name IN ('Mayhren','Kohplan')
                     AND weizen_kg > 50;" },

            { 3, @"SELECT id, name, age, geschlecht
                   FROM dorfbewohner
                   WHERE arbeit IS NULL AND im_dorf = 1;" },

            { 4, @"SELECT id, name, weizen_kg
                   FROM stall
                   WHERE bearbeiter_id IS NULL;" },

            { 5, @"SELECT name, eisen, kohle, holz
                   FROM schmied
                   WHERE name = 'Grondolf';" },

            { 6, @"SELECT eingang, wachposten_id
                   FROM wache;" },

            { 7, @"SELECT id, name, age
                   FROM dorfbewohner
                   WHERE in_ausbildung = 1;" },

            { 8, @"SELECT name, anfuehrer, freundlich
                   FROM doerfer
                   ORDER BY entfernung_km ASC;" },

            { 9, @"SELECT name, anzahl_bewohner, entfernung_km, anfuehrer
                   FROM doerfer
                   WHERE anzahl_bewohner < 1000
                     AND entfernung_km <= 50
                     AND freundlich = 0;" }
        };

        // =========================
        // SQL AUSFÜHREN
        // =========================
        private List<Dictionary<string, object>> ExecuteQuery(string sql)
        {
            var result = new List<Dictionary<string, object>>();
            var cs = _config.GetConnectionString("GameDb");

            using var con = new MySqlConnection(cs);
            con.Open();

            using var cmd = new MySqlCommand(sql, con);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                var row = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                    row[reader.GetName(i)] = reader.GetValue(i);

                result.Add(row);
            }

            return result;
        }

        // =========================
        // SPIEL-ENDPOINT
        // =========================
        [HttpPost("sql")]
        public IActionResult ExecuteSql([FromBody] SqlRequest request)
        {
            if (!Levels.ContainsKey(request.Level))
                return BadRequest("Ungültiges Level");

            if (string.IsNullOrWhiteSpace(request.Query))
                return BadRequest("SQL fehlt");

            if (!request.Query.Trim().ToLower().StartsWith("select"))
                return BadRequest("Nur SELECT erlaubt");

            var userResult = ExecuteQuery(request.Query);
            var expectedResult = ExecuteQuery(Levels[request.Level]);

            bool correct =
                userResult.Count == expectedResult.Count &&
                userResult.All(r =>
                    expectedResult.Any(er =>
                        er.SequenceEqual(r)
                    )
                );

            return Ok(new
            {
                correct,
                data = userResult,
                nextLevel = correct ? request.Level + 1 : request.Level
            });
        }
    }
}
