import { readFile } from "node:fs/promises";

const host = "colorfit.pagecheckai.com";
const key = "62434faa91efd58495e0d767e9fd2575";
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});

console.log(`IndexNow submitted ${urlList.length} URLs: ${response.status} ${response.statusText}`);
if (!response.ok && response.status !== 202) process.exitCode = 1;
