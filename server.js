import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.get("/mcp", (_req, res) => {
  res.json({
    name: "StupidImageService",
    version: "1.0.0",
    capabilities: ["tools"],
    tools: [
      {
        name: "return_demo_image",
        description: "Return a single online image as markdown.",
        parameters: {
          type: "object",
          properties: {
            topic: { type: "string", description: "Optional alt text/topic" }
          }
        }
      },
      {
        name: "return_demo_gallery",
        description: "Return a tiny gallery (3 images) as markdown.",
        parameters: { type: "object", properties: {} }
      }
    ]
  });
});

const IMAGES = [
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Glasses_800x600.jpg",
    alt: "Glasses on a table"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
    alt: "Red eyeglasses"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Sunglasses_black.jpg",
    alt: "Black sunglasses"
  }
];

app.post("/mcp/tools/return_demo_image", (req, res) => {
  const { topic } = req.body || {};
  const img = IMAGES[0];
  const alt = topic || img.alt;
  const md = `![${escapeMd(alt)}](${img.url})\n**${escapeMd(alt)}**\n${img.url}\n`;
  res.json({ type: "markdown", markdown: md, data: { image: img, topic: topic ?? null } });
});

app.post("/mcp/tools/return_demo_gallery", (_req, res) => {
  const md = IMAGES.map(({ url, alt }) => `![${escapeMd(alt)}](${url})\n**${escapeMd(alt)}**\n${url}\n`).join("\n");
  res.json({ type: "markdown", markdown: md, data: { images: IMAGES } });
});

function escapeMd(s = "") {
  return String(s).replace(/\*/g, "\\*").replace(/_/g, "\\_");
}

export default app; // important: export the express app
