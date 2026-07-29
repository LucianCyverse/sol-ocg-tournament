import { access, readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error("Usage: node tools/convert-srt-to-vtt.mjs <input.srt> <output.vtt>");
}

try {
  await access(outputPath);
  throw new Error(`Refusing to overwrite existing output: ${outputPath}`);
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

const source = (await readFile(inputPath, "utf8"))
  .replace(/^\uFEFF/, "")
  .replace(/\r\n?/g, "\n")
  .trim();

const body = source
  .split("\n")
  .map((line) =>
    line.includes(" --> ")
      ? line.replace(
          /(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/,
          "$1.$2 --> $3.$4",
        )
      : line,
  )
  .join("\n");

await writeFile(outputPath, `WEBVTT\n\n${body}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
