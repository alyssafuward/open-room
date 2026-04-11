# Open Room

Open Room is a community-built building — an infinite floor plan where every room is designed and contributed by a real person, with help from AI.

## How it works

Rooms on the floor plan are real contributions. Each room is a folder in this repo containing a background image and a `config.json` that defines what's inside — clickable hotspots, links, artwork, anything. When a PR is merged, the room goes live.

## Contribute a room

1. **Reserve your spot** — visit the live site, click **+ Add Room** on the floor plan, and fill out the form. You'll get a room ID (e.g. `warm-harbor`).
2. **Fork this repo** on GitHub.
3. **Copy the template** *[AI recommended]* — duplicate `public/registry/_template/` and rename it to `public/registry/your-room-id/`.
4. **Build your room** *[AI recommended]* — add a background image and edit `config.json` to define your hotspots. See the [template README](public/registry/_template/README.md) for the full schema.
5. **Open a Pull Request** *[AI recommended]* — include a screenshot of your room. Once merged, your tile on the floor plan becomes live.

## The vibe

This project is built with AI assistance — Claude Code is recommended, but any AI tool works. You don't need to be a developer. You need an idea, an image, and a willingness to figure it out.

## Building codes

- Every image in the room, including background images: JPEG or WebP, max 200KB
- Total room folder: max 5MB
- One room per builder. Exceptions by request.
