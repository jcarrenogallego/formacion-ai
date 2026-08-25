const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const port = Number(process.env.PORT ?? 3000);
const publicDirectory = path.join(__dirname, "public");

function getApiUrl() {
  return process.env.API_URL
    ?? process.env.services__api__https__0
    ?? process.env.services__api__http__0
    ?? "http://localhost:5080";
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

async function proxyToApi(request, response) {
  const apiResponse = await fetch(new URL(request.url, getApiUrl()), {
    method: request.method,
    headers: { "content-type": request.headers["content-type"] ?? "application/json" },
    body: request.method === "GET" ? undefined : request
  });

  response.writeHead(apiResponse.status, {
    "content-type": apiResponse.headers.get("content-type") ?? "application/json"
  });
  response.end(Buffer.from(await apiResponse.arrayBuffer()));
}

async function serveStatic(request, response) {
  const requestedPath = request.url === "/" ? "/index.html" : request.url;
  const filePath = path.join(publicDirectory, path.normalize(requestedPath));

  if (!filePath.startsWith(publicDirectory)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    response.writeHead(200, { "content-type": contentTypes[path.extname(filePath)] ?? "application/octet-stream" });
    response.end(content);
  } catch {
    response.writeHead(404).end("Not found");
  }
}

http.createServer(async (request, response) => {
  try {
    if (request.url.startsWith("/api/")) {
      await proxyToApi(request, response);
      return;
    }

    await serveStatic(request, response);
  } catch (error) {
    console.error(error);
    response.writeHead(502, { "content-type": "application/json" });
    response.end(JSON.stringify({ detail: "No fue posible comunicarse con la API." }));
  }
}).listen(port, () => console.log(`Delivery Board disponible en http://localhost:${port}`));
