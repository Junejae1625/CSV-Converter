const fs = require("fs");
const iconv = require("iconv-lite");
const jschardet = require("jschardet");
const { Transform } = require("stream");

function convertToUTF8(inputFilePath, outputFilePath, callback) {
  const buffer = fs.readFileSync(inputFilePath);
  const detectedEncoding = jschardet.detect(buffer).encoding;

  console.log(`File ${inputFilePath} detected encoding: ${detectedEncoding}`);

  if (detectedEncoding === "UTF-8") {
    fs.copyFile(inputFilePath, outputFilePath, (error) => {
      if (error) {
        console.error(`Error copying file ${inputFilePath} to output:`, error);
      } else {
        console.log(`File ${inputFilePath} copied to ${outputFilePath}.`);
      }
      callback(error);
    });
    return;
  }

  const readStream = fs.createReadStream(inputFilePath);
  const writeStream = fs.createWriteStream(outputFilePath);

  let convertedBytes = 0;

  const convertStream = new Transform({
    transform(chunk, encoding, callback) {
      const convertedChunk = iconv.decode(chunk, detectedEncoding);
      convertedBytes += convertedChunk.length;
      this.push(convertedChunk);
      callback();
    },
  });

  const dateRegex = /(\d{4})(\d{2})(\d{2})/;

  const lineTransform = new Transform({
    transform(chunk, encoding, callback) {
      const lines = chunk.toString().split(/\r\n|\r|\n/);
      const convertedLines = lines.map((line) => {
        return line.replace(dateRegex, `$1/$2/$3`);
      });
      const convertedChunk = convertedLines.join(`\n`);
      convertedBytes += convertedChunk.length;
      this.push(convertedChunk);
      callback();
    },
  });

  readStream.pipe(convertStream).pipe(lineTransform).pipe(writeStream);

  readStream.on("close", () => {
    console.log(`File ${inputFilePath} converted successfully.`);
    callback(null);
  });

  readStream.on("error", (error) => {
    console.error("File read error:", error);
    callback(error);
  });

  writeStream.on("finish", () => {
    console.log(
      `File ${inputFilePath} converted to ${outputFilePath} (${convertedBytes} bytes).`
    );
  });

  writeStream.on("error", (error) => {
    console.error("File write error:", error);
    callback(error);
  });
}

module.exports = convertToUTF8;
