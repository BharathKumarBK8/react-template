const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Create config server
const configServer = jsonServer.create();
// Create API server
const apiServer = jsonServer.create();

// Add middleware
configServer.use(cors());
apiServer.use(cors());

// Function to load all JSON files from a directory
// Modify the loadJsonFiles function
const loadJsonFiles = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    console.warn(`Directory not found: ${directoryPath}`);
    return {};
  }

  const files = fs.readdirSync(directoryPath);
  return files.reduce((acc, file) => {
    if (path.extname(file).toLowerCase() === ".json") {
      const filePath = path.join(directoryPath, file);
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const fileName = path.basename(file, ".json");
        acc[fileName] = JSON.parse(fileContent);
        return acc;
      } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return acc;
      }
    }
    return acc;
  }, {});
};

const saveJsonFile = (filePath, data) => {
  try {
    // Extract the filename without extension
    const fileName = path.basename(filePath, ".json");

    // If data has a top-level key matching the filename, use its value
    // Otherwise use the data as is
    const dataToSave = data.hasOwnProperty(fileName) ? data[fileName] : data;

    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving to ${filePath}:`, error);
    return false;
  }
};

// Uncomment and modify the dynamic route
configServer.get("/:dynamicFilename", (req, res) => {
  const dynamicFilename = req.params.dynamicFilename;
  const filePath = path.join(configDbPath, `${dynamicFilename}.json`);

  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      res.status(200).json(data[dynamicFilename] || data); // Return direct data if no top-level key
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
      res.status(500).json({ error: `Failed to read ${dynamicFilename}.json` });
    }
  } else {
    res.status(404).json({ error: `${dynamicFilename}.json not found` });
  }
});

// Load databases from respective directories
const dbfolder = process.argv[2] || "DB"; // defaults to '@DB' if no argument provided
const configDbPath = path.join(__dirname, dbfolder, "config");
const apiDbPath = path.join(__dirname, dbfolder, "api");

const configDb = loadJsonFiles(configDbPath);
const apiDb = loadJsonFiles(apiDbPath);

// Create routers
const configRouter = jsonServer.router(configDb);
const apiRouter = jsonServer.router(apiDb);

apiServer.post("/pushconfig-data", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body);

      // Save to pushconfig-data.json
      const pushconfigPath = path.join(
        __dirname,
        dbfolder,
        "api",
        "pushconfig-data.json"
      );
      saveJsonFile(pushconfigPath, { "pushconfig-data": parsed });

      // Get the target from appData and update the corresponding configuration
      const target = parsed.appData?.target;
      if (target) {
        const targetPath = path.join(
          __dirname,
          dbfolder,
          "config",
          `${target}.json`
        );

        try {
          // Initialize default configuration structure
          let targetConfig = {
            buttons: [],
          };

          // Read existing target configuration if it exists
          if (fs.existsSync(targetPath)) {
            try {
              const fileContent = fs.readFileSync(targetPath, "utf8");
              const parsedContent = JSON.parse(fileContent);
              // Merge existing configuration with default structure
              targetConfig = {
                ...targetConfig,
                ...(parsedContent[target] || parsedContent),
              };
            } catch (readError) {
              console.warn(
                `Error reading existing config, using defaults:`,
                readError
              );
            }
          }

          // Create new button configuration
          const newButton = {
            id: "pushconfig",
            type: "button",
            text: "Push Config",
            theme: "btn_black",
          };

          // Find existing button index
          const existingButtonIndex = targetConfig.buttons.findIndex(
            (button) => button.id === "pushconfig"
          );

          // Update or add the button
          if (existingButtonIndex >= 0) {
            targetConfig.buttons[existingButtonIndex] = newButton;
          } else {
            targetConfig.buttons.push(newButton);
          }

          // Save updated configuration
          saveJsonFile(targetPath, targetConfig);

          res.status(200).json({
            message: "Configuration updated successfully",
            target: target,
          });
        } catch (err) {
          console.error(`Error updating ${target} configuration:`, err);
          res.status(500).json({
            error: `Failed to update ${target} configuration`,
          });
        }
      } else {
        res.status(200).json({
          message: "Configuration saved without target update",
        });
      }
    } catch (err) {
      console.error("Invalid JSON payload received:", err);
      res.status(400).json({ error: "Invalid JSON payload" });
    }
  });
});

// Add middleware to handle data persistence
configRouter.render = (req, res) => {
  // Save changes after each write operation
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    // Get the entity name from the URL path
    const urlParts = req.url.split("/");
    const entity = urlParts[1]; // This will get the resource name from the URL

    if (entity) {
      const db = configRouter.db.getState();
      const entityData = db[entity];

      if (entityData !== undefined) {
        const filePath = path.join(configDbPath, `${entity}.json`);
        saveJsonFile(filePath, { [entity]: entityData });
      }
    }
  }
  res.jsonp(res.locals.data);
};

apiRouter.render = (req, res) => {
  // Save changes after each write operation
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    // Get the entity name from the URL path
    const urlParts = req.url.split("/");
    const entity = urlParts[1]; // This will get the resource name from the URL

    if (entity) {
      const db = apiRouter.db.getState();
      const entityData = db[entity];

      if (entityData !== undefined) {
        const filePath = path.join(apiDbPath, `${entity}.json`);
        saveJsonFile(filePath, { [entity]: entityData });
      }
    }
  }
  res.jsonp(res.locals.data);
};

// Add default middlewares
configServer.use(jsonServer.defaults());
apiServer.use(jsonServer.defaults());

// Error handling
configServer.use((err, req, res, next) => {
  console.error("Config Server Error:", err.stack);
  res.status(500).json({ error: "Internal Config Server Error" });
});

apiServer.use((err, req, res, next) => {
  console.error("API Server Error:", err.stack);
  res.status(500).json({ error: "Internal API Server Error" });
});

// Use routers
configServer.use(configRouter);
apiServer.use(apiRouter);

// Start servers
const CONFIG_PORT = 5001;
const API_PORT = 5002;

configServer.listen(CONFIG_PORT, () => {
  console.log(`Configuration server is running on port ${CONFIG_PORT}`);
  console.log(`Config files loaded from: ${configDbPath}`);
});

apiServer.listen(API_PORT, () => {
  console.log(`API server is running on port ${API_PORT}`);
  console.log(`API files loaded from: ${apiDbPath}`);
});
