const fs = require("fs");
const path = require("path");

const sourceDirs = [
  { source: "backend/target/idl", extensions: [".json"] },
  { source: "backend/target/types", extensions: [".ts"] },
];
const destination = "frontend/src/programs";

const copyFiles = () => {
  sourceDirs.forEach(({ source, extensions }) => {
    const files = fs.readdirSync(source);

    files.forEach((file) => {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        const srcPath = path.join(source, file);
        const destPath = path.join(destination, file);

        // Ensure destination directory exists
        fs.mkdirSync(destination, { recursive: true });

        // Copy the file
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcPath} -> ${destPath}`);
      }
    });
  });
};

copyFiles();
