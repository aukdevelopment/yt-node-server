import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "workerpool";
import { error, log } from "node:console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;

const fileReadPool = pool(join(__dirname, "file-read-workers.js"));

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  if (req.url === "/") {
    // read file and send it
    fileReadPool
      .exec("html", ["index.html"])
      .then((result) => res.end(result))
      .catch((err) => {
        error(err);
        res.end();
      })
      .then(() => fileReadPool.terminate());
  } else if (req.url === "/about") {
    // read file and send it
    fileReadPool
      .exec("html", ["about.html"])
      .then((result) => res.end(result))
      .catch((err) => {
        error(err);
        res.end();
      })
      .then(() => fileReadPool.terminate());
  }
});

server.listen(port, () => log("server running : " + port));
