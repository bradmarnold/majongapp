# majongapp

This monorepo contains a simple Hong Kong Mahjong web game.

## Getting started

### Upload tile assets
Place your Mahjong tile images in **assets/tiles/** with the exact file names:

- `char_1.png` … `char_9.png`
- `bamboo_1.png` … `bamboo_9.png`
- `dot_1.png` … `dot_9.png`
- `wind_e.png`, `wind_s.png`, `wind_w.png`, `wind_n.png`
- `dragon_red.png`, `dragon_green.png`, `dragon_white.png`
- `flower_1.png` … `flower_4.png`
- `season_1.png` … `season_4.png`
- `tile_back.png`

If the folder is empty, the front end will show placeholder tiles until you add your own images.

### Set up OpenAI key on Vercel
This project uses a serverless function to return a beginner‑friendly tip from a Mahjong summary. To enable LLM phrasing, add an environment variable called **OPENAI_API_KEY** in your Vercel project settings. Without it, the API will simply echo the summary you send.

You should also set **ALLOWED_ORIGIN** to `https://bradmarnold.github.io` so that the GitHub Pages site can call the API. Replace `bradmarnold` with your GitHub username if you fork this repo.

### URLs

After deployment, access the API and front end at:

- **Front end (GitHub Pages)** – https://bradmarnold.github.io/majongapp/
- **API (Vercel)** – https://majongapp.vercel.app/api/advice

Use a POST request to the API with a JSON body containing a `summary` field, for example:

```bash
curl -X POST https://majongapp.vercel.app/api/advice \
  -H "Content-Type: application/json" \
  -d '{"summary":"You are in tenpai. Discard 9m."}'
```

The response will include a `tip` property.
