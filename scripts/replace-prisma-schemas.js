const fs = require("fs");
const path = require("path");

function replaceAllPrismaSchemas() {
  // Read the current directory's Prisma schema
  const currentSchemaPath = path.join(
    process.cwd(),
    "apps",
    "frontend",
    "prisma",
    "schema.prisma"
  );

  if (!fs.existsSync(currentSchemaPath)) {
    console.error(
      "No schema.prisma found in the current directory's prisma folder"
    );
    process.exit(1);
  }

  const currentSchema = fs.readFileSync(currentSchemaPath, "utf8");

  // Function to recursively find and replace Prisma schemas
  function findAndReplacePrismaSchemas(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Ignore node_modules and .git directories
        if (file !== "node_modules" && file !== ".git") {
          findAndReplacePrismaSchemas(fullPath);
        }
      } else if (file === "schema.prisma" && fullPath !== currentSchemaPath) {
        // Replace the schema
        fs.writeFileSync(fullPath, currentSchema);
        console.log(`Replaced schema at: ${fullPath}`);
      }
    });
  }

  // Start searching from the root of the project
  findAndReplacePrismaSchemas(process.cwd());

  console.log("Prisma schema replacement complete!");
}

replaceAllPrismaSchemas();
