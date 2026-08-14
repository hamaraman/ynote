import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.resolve("content/policy");
const markdownFiles = fs.readdirSync(dir).filter((name) => name.endsWith(".md")).sort();

const records = markdownFiles.map((file) => {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const bodyLinks = [...content.matchAll(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/g)].map((match) => match[1]);
  const applyUrl = typeof data.applyUrl === "string" ? data.applyUrl : "";
  const officialUrl = typeof data.officialUrl === "string" ? data.officialUrl : "";

  return {
    slug: file.replace(/\.md$/, ""),
    title: typeof data.title === "string" ? data.title : "",
    applyUrl,
    officialUrl,
    bodyLinks,
  };
});

const withDirectApplicationUrl = records.filter((record) => record.applyUrl);
const withOfficialUrl = records.filter((record) => record.officialUrl);
const withBodyLink = records.filter((record) => record.bodyLinks.length > 0);
const withoutKnownLink = records.filter(
  (record) => !record.applyUrl && !record.officialUrl && record.bodyLinks.length === 0,
);

console.log(
  JSON.stringify(
    {
      totals: {
        policyFiles: records.length,
        withDirectApplicationUrl: withDirectApplicationUrl.length,
        withOfficialUrl: withOfficialUrl.length,
        withBodyLink: withBodyLink.length,
        withoutKnownLink: withoutKnownLink.length,
      },
      noKnownLink: withoutKnownLink.map(({ slug, title }) => ({ slug, title })),
      samples: records.slice(0, 10),
    },
    null,
    2,
  ),
);
