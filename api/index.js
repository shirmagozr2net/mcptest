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

function escapeMd(s = "") {
  return String(s).replace(/\*/g, "\\*").replace(/_/g, "\\_");
}

export default function handler(req, res) {
  // Enable CORS with specific headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
  
  // Handle preflight requests with 204
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const { url } = req;
  
  // Handle GET /mcp
  if (req.method === 'GET' && url === '/mcp') {
    res.status(200).json({
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
    return;
  }
  
  // Handle POST /mcp/tools/return_demo_image
  if (req.method === 'POST' && url === '/mcp/tools/return_demo_image') {
    const { topic } = req.body || {};
    const img = IMAGES[0];
    const alt = topic || img.alt;
    const md = `![${escapeMd(alt)}](${img.url})\n**${escapeMd(alt)}**\n${img.url}\n`;
    res.status(200).json({ type: "markdown", markdown: md, data: { image: img, topic: topic ?? null } });
    return;
  }
  
  // Handle POST /mcp/tools/return_demo_gallery
  if (req.method === 'POST' && url === '/mcp/tools/return_demo_gallery') {
    const md = IMAGES.map(({ url, alt }) => `![${escapeMd(alt)}](${url})\n**${escapeMd(alt)}**\n${url}\n`).join("\n");
    res.status(200).json({ type: "markdown", markdown: md, data: { images: IMAGES } });
    return;
  }
  
  // Handle 404
  res.status(404).json({ error: 'Not found' });
}