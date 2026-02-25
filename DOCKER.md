# Docker Setup for MediaTracker UI

> **This is a fork of [bonukai/MediaTracker](https://github.com/bonukai/MediaTracker)** with enhanced UI/UX improvements. The Docker configuration is compatible with the original, with additional images published to `ghcr.io/growlergary/mediatracker`.

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/GrowlerGary/MediaTracker.git
cd MediaTracker

# Build and run
docker-compose up -d

# Access the app
open http://localhost:7481
```

### Option 2: Using Pre-built Image

```bash
# Create a docker-compose file
curl -o docker-compose.yml https://raw.githubusercontent.com/GrowlerGary/MediaTracker/main/docker-compose.prebuilt.yml

# Run it
docker-compose up -d
```

### Option 3: Build Your Own Image

```bash
# Clone and build
git clone https://github.com/GrowlerGary/MediaTracker.git
cd MediaTracker
docker build -t mediatracker-ui .

# Run
docker run -d \
  --name mediatracker-ui \
  -p 7481:7481 \
  -v mediatracker-storage:/storage \
  -v mediatracker-assets:/assets \
  -e TMDB_LANG=en \
  -e SERVER_LANG=en \
  -e TZ=America/New_York \
  --restart unless-stopped \
  mediatracker-ui
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `7481` |
| `HOSTNAME` | Bind address | `0.0.0.0` |
| `SERVER_LANG` | Server language | `en` |
| `TMDB_LANG` | TMDB API language | `en` |
| `AUDIBLE_LANG` | Audible language | `us` |
| `TZ` | Timezone | `UTC` |
| `PUID` | User ID | `1000` |
| `PGID` | Group ID | `1000` |
| `DATABASE_CLIENT` | Database type | `better-sqlite3` |
| `IGDB_CLIENT_ID` | IGDB API ID (optional) | - |
| `IGDB_CLIENT_SECRET` | IGDB API Secret (optional) | - |

### Volumes

| Volume | Path | Description |
|--------|------|-------------|
| `mediatracker-storage` | `/storage` | Database and config |
| `mediatracker-assets` | `/assets` | Posters and images |
| `mediatracker-logs` | `/logs` | Application logs |

## Docker Compose Examples

### Basic Setup

```yaml
version: '3.8'
services:
  mediatracker:
    image: ghcr.io/growlergary/mediatracker:latest
    container_name: mediatracker-ui
    ports:
      - "7481:7481"
    volumes:
      - ./storage:/storage
      - ./assets:/assets
    environment:
      - TMDB_LANG=en
      - TZ=America/New_York
    restart: unless-stopped
```

### With Reverse Proxy (Traefik)

```yaml
version: '3.8'
services:
  mediatracker:
    image: ghcr.io/growlergary/mediatracker:latest
    container_name: mediatracker-ui
    environment:
      - TMDB_LANG=en
      - TZ=America/New_York
    volumes:
      - mediatracker-storage:/storage
      - mediatracker-assets:/assets
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.mediatracker.rule=Host(`mediatracker.yourdomain.com`)"
      - "traefik.http.routers.mediatracker.tls.certresolver=letsencrypt"
    restart: unless-stopped
    networks:
      - traefik

volumes:
  mediatracker-storage:
  mediatracker-assets:

networks:
  traefik:
    external: true
```

### Using Original Image

If you prefer the original MediaTracker without UI modifications:

```yaml
version: '3.8'
services:
  mediatracker:
    image: bonukai/mediatracker:latest
    container_name: mediatracker
    ports:
      - "7481:7481"
    volumes:
      - ./storage:/storage
      - ./assets:/assets
    environment:
      - TMDB_LANG=en
      - TZ=America/New_York
    restart: unless-stopped
```

## Available Images

| Image | Description |
|-------|-------------|
| `ghcr.io/growlergary/mediatracker:latest` | This fork with UI enhancements |
| `ghcr.io/growlergary/mediatracker:main` | Latest commit from main branch |
| `bonukai/mediatracker:latest` | Original project (stable) |
| `bonukai/mediatracker:unstable` | Original project (pre-releases) |

## Updating

```bash
# Pull latest image from this fork
docker-compose pull
docker-compose up -d

# Or update to original
docker pull bonukai/mediatracker:latest
docker-compose up -d
```

## Troubleshooting

### Check logs
```bash
docker-compose logs -f mediatracker
```

### Reset container
```bash
docker-compose down
docker-compose up -d
```

### View health status
```bash
docker ps
# or
docker inspect mediatracker-ui
```

## UI Improvements in This Fork

This Docker image includes the following UI/UX enhancements:

- 🎨 Modern design system with consistent colors and typography
- ✨ Glass morphism effects on cards and navigation
- 🔄 Animated loading states with skeleton screens
- 📭 Beautiful empty states for better user guidance
- 📱 Improved mobile responsiveness
- 🎯 Enhanced navigation with sticky header
- ⭐ Better media cards with hover effects
- 📊 Progress indicators and rating badges
- 🔍 Improved search and pagination UI

All improvements are purely client-side and do not affect the API or database structure.

## Attribution

- **Original Project:** [bonukai/MediaTracker](https://github.com/bonukai/MediaTracker)
- **Original Docker Image:** `bonukai/mediatracker`
- **Fork Author:** [@GrowlerGary](https://github.com/GrowlerGary)
- **License:** MIT (same as original)

---

For the original project's Docker documentation, see: https://github.com/bonukai/MediaTracker
