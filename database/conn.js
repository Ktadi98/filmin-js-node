import { createConnection } from "mysql";

const conn = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "filminproyectodb",
});

conn.connect((err) => {
  if (err) throw err;
  console.log("conexión a la BD correcta!");
});

export default conn;
