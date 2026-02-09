namespace SqlValhalla.Api.Models
{
    public class SqlRequest
    {
        public int Level { get; set; }
        public string Query { get; set; } = string.Empty;
    }
}