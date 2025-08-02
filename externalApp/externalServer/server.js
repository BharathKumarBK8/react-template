const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5003;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, "external-data.json");

// Load existing data or initialize with an empty array
let externalData = [];
if (fs.existsSync(DATA_FILE)) {
  externalData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Generic GET
app.get("/:dynamicPath", (req, res) => {
  const { dynamicPath } = req.params;
  const matchedData = externalData.filter(
    (entry) => entry.path === dynamicPath
  );
  res.status(200).json(matchedData);
});

// Generic POST
app.post("/:dynamicPath", (req, res) => {
  const { dynamicPath } = req.params;
  const data = req.body;

  // Save new entry
  const entry = { path: dynamicPath, ...data };
  externalData.push(entry);

  // Write to file
  fs.writeFileSync(DATA_FILE, JSON.stringify(externalData, null, 2), "utf8");

  res.status(200).json({ message: "Data saved successfully", entry });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
