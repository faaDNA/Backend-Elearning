import { createServer } from "http";
import { IncomingForm } from "formidable";

const PORT = 3000;

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "Ini adalah endpoint GET sederhana!",
        info: "Akses endpoint ini dengan metode GET",
      })
    );
  } else if (req.method === "POST" && req.url === "/data") {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        res.setHeader("Content-Type", "application/json");
        if (err) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Gagal parsing form-data!",
              error: err.message,
            })
          );
        } else {
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              message: "Data form-data diterima!",
              fields,
              files,
            })
          );
        }
      });
    } else {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        res.setHeader("Content-Type", "application/json");
        if (contentType.includes("application/json")) {
          try {
            const data = body ? JSON.parse(body) : null;
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Data JSON diterima!", data }));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: "Format JSON tidak valid!" }));
          }
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          const parsed: Record<string, string> = {};
          body.split("&").forEach((pair) => {
            const [key, value] = pair.split("=");
            parsed[decodeURIComponent(key)] = decodeURIComponent(value || "");
          });
          res.statusCode = 200;
          res.end(
            JSON.stringify({ message: "Data form diterima!", data: parsed })
          );
        } else {
          res.statusCode = 415;
          res.end(JSON.stringify({ message: "Content-Type tidak didukung!" }));
        }
      });
    }
  } else {
    res.statusCode = 404;
    res.end("Endpoint tidak ditemukan!");
  }
});

server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
