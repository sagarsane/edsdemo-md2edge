import { fromHtml } from "hast-util-from-html";
import markdownItToHtml from "./MarkdownIt.js";
import { h } from "hastscript";
import { raw } from "hast-util-raw";
import rehypeFormat from "rehype-format";
import { toHtml } from "hast-util-to-html";

export default async function md2html(mdString) {
  const convertedHtml = markdownItToHtml(mdString);
  const main = fromHtml(convertedHtml, { fragment: true });

  const content = {
    hast: main,
  };

  // Add the Left and Right Rail content as part of their respective Placeholders
  const hast = h("html", [
    h("body", [
      h("header", []),
      h("main", [
        h("div", content.hast), // Base Content - Must be first child for proper rendering
      ]),
      h("footer", []),
    ]),
  ]);

  raw(hast);
  rehypeFormat()(hast);

  return toHtml(hast, {
    upperDoctype: true,
  });
}
