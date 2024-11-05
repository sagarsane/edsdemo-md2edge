import markdownit from "markdown-it";
import attrs from "markdown-it-attrs";
import anchor from "markdown-it-anchor";
import abbr from "markdown-it-abbr";
import collapsible from "markdown-it-collapsible";
import container from "markdown-it-container";
import deflist from "markdown-it-deflist";
import footnote from "markdown-it-footnote";
import ins from "markdown-it-ins";
import mark from "markdown-it-mark";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import meta from "markdown-it-meta";

export default function markdownItToHtml(mdString) {
  const md = markdownit({
    html: true,
    breaks: true,
    typographer: true,
  })
    .use(abbr)
    .use(attrs, {
      allowedAttributes: ["id", "class", "style", "target"],
    })
    .use(anchor, { level: [1, 2, 3, 4, 5, 6], slugify: () => "" })
    .use(collapsible)
    .use(container, "warning")
    .use(deflist)
    .use(footnote)
    .use(ins)
    .use(mark)
    .use(sub)
    .use(sup)
    .use(meta);

  return toHtmlDoc(md.render(mdString), md.meta);
}

const metaToHtml = (meta) => {
  let metaHtml = "";
  for (const key in meta) {
    metaHtml += `\n<meta name="${key}" content="${meta[key]}">`;
  }
  return metaHtml;
};

const toHtmlDoc = (mainHtml, meta) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>${meta.title}</title>
      ${metaToHtml(meta)}
    </head>
    <body>
      <header></header>
      <main>
        <div>
          ${mainHtml}
        </div>
      </main>
      <footer></footer>
    </body>
  </html>
  `;
};
