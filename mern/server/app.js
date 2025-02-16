import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5015;

app.use(express.static(path.join(__dirname, "dist")));

app.get("/omer", (req, res) => {
  try {
    res.status(200).json({ message: "Hello omer!" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
