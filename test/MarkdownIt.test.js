import markdownItToHtml from "../actions/md2html/MarkdownIt.js";
import fs from "fs";

test("expected HTML", () => {
  // read file test.md as a string sync
  const mdString = fs.readFileSync("test/test.md", "utf8");
  const convertedHtml = markdownItToHtml(mdString);
  console.log(convertedHtml);
  expect(convertedHtml).toBe("");
});
