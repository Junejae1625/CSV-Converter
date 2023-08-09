const fs = require("fs");
const path = require("path");
const csvConverter = require("./csvConverter");

const inputDirectory = path.join(__dirname, "input_csv");
const outputDirectory = path.join(__dirname, "output_csv");

fs.readdir(inputDirectory, (err, files) => {
  if (err) {
    console.error("Error reading input directory:", err);
    return;
  }

  console.log("Starting conversion process...");
  console.log("-----------------------------------------");

  const totalFiles = files.length;
  let convertedFiles = 0;

  files.forEach((file) => {
    const inputFilePath = path.join(inputDirectory, file);
    const outputFilePath = path.join(outputDirectory, file);

    csvConverter(inputFilePath, outputFilePath, (error) => {
      if (error) {
        console.error(`Conversion error for file ${file}:`, error);
      }

      convertedFiles++;
      if (convertedFiles === totalFiles) {
        console.log("-----------------------------------------");
        console.log("All files have been converted.");
      }
    });
  });
});
