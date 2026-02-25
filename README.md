# MediaTracker (UI Enhanced Fork)

> **This is a fork of [bonukai/MediaTracker](https://github.com/bonukai/MediaTracker)** with significant UI/UX improvements while maintaining full compatibility with the original API and database structure.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/GrowlerGary/MediaTracker/blob/main/LICENSE.md)
[![Docker Image Size](https://img.shields.io/docker/image-size/growlergary/mediatracker)](https://hub.docker.com/r/growlergary/mediatracker)
[![Docker Pulls](https://img.shields.io/docker/pulls/growlergary/mediatracker)](https://hub.docker.com/r/growlergary/mediatracker)

Self-hosted media tracker for movies, TV shows, video games, books, and audiobooks with an enhanced modern UI.

## 🎨 What's Different in This Fork?

This fork includes comprehensive UI/UX enhancements:

- 🎨 **Modern Design System** — Consistent colors, typography, and spacing with Tailwind CSS
- ✨ **Glass Morphism Effects** — Modern frosted glass cards and navigation
- 🔄 **Animated Loading States** — Skeleton screens instead of spinners
- 📭 **Beautiful Empty States** — Helpful guidance when there's no content
- 📱 **Improved Mobile Experience** — Better responsive design
- 🎯 **Enhanced Navigation** — Sticky header with smooth transitions
- ⭐ **Better Media Cards** — Hover effects, progress bars, and quick actions
- 🔍 **Improved Search** — Better pagination and filtering UI

**All features from the original are preserved.** The API, database structure, and Docker compatibility remain unchanged.

## 🚀 Quick Start

### Using Docker Compose

```bash
# Clone this fork
git clone https://github.com/GrowlerGary/MediaTracker.git
cd MediaTracker

# Run with Docker Compose
docker-compose up -d

# Access at http://localhost:7481
```

### Using Pre-built Image

```bash
docker run -d \
  --name mediatracker-ui \
  -p 7481:7481 \
  -v mediatracker-storage:/storage \
  -v mediatracker-assets:/assets \
  -e TMDB_LANG=en \
  -e TZ=America/New_York \
  --restart unless-stopped \
  ghcr.io/growlergary/mediatracker:latest
```

See [DOCKER.md](./DOCKER.md) for detailed Docker configuration options.

## 📸 Original Project

This fork is based on the excellent work of **bonukai/MediaTracker**:

- **Original Repository:** https://github.com/bonukai/MediaTracker
- **Original Docker Image:** `bonukai/mediatracker`
- **Original Author:** [@bonukai](https://github.com/bonukai)

### Why This Fork?

The original MediaTracker is a fantastic self-hosted media tracking solution. This fork focuses exclusively on improving the user interface and experience while maintaining 100% compatibility with the original's features, API, and data format.

**Use this fork if you want:**
- A more modern, polished UI
- Better mobile experience
- Smoother animations and transitions
- Improved accessibility

**Use the original if you prefer:**
- The classic UI design
- The author's direct support and updates
- Guaranteed stability without UI modifications

## ✨ Features (from Original)

- Track movies, TV shows, video games, books, and audiobooks
- Notifications for new releases
- Calendar view of upcoming media
- Multiple user support
- REST API
- Watchlist management
- Import from Trakt and Goodreads
- Jellyfin, Plex, and Kodi integrations
- Multiple metadata providers (TMDB, IGDB, Audible, Open Library)

## 🐳 Docker

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TMDB_LANG` | TMDB API language | `en` |
| `AUDIBLE_LANG` | Audible language | `us` |
| `SERVER_LANG` | Server language | `en` |
| `TZ` | Timezone | `UTC` |
| `DATABASE_CLIENT` | Database type | `better-sqlite3` |

### Volumes

| Volume | Path | Description |
|--------|------|-------------|
| `mediatracker-storage` | `/storage` | Database and config |
| `mediatracker-assets` | `/assets` | Posters and images |
| `mediatracker-logs` | `/logs` | Application logs |

## 🛠️ Building from Source

```bash
git clone https://github.com/GrowlerGary/MediaTracker.git
cd MediaTracker
npm install
npm run build
npm run start
```

## 📄 License

This project maintains the same [MIT License](./LICENSE.md) as the original MediaTracker project.

## 🙏 Acknowledgments

- **Original Author:** [@bonukai](https://github.com/bonukai) for creating MediaTracker
- **Inspired by:** [flox](https://github.com/devfake/flox)
- **Contributors:** All contributors to the original project

---

## Original README

For the original project's documentation, see [bonukai/MediaTracker](https://github.com/bonukai/MediaTracker).

<details>
<summary>Click to expand original README</summary>

# MediaTracker &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bonukai/MediaTracker/blob/main/LICENSE.md) [![Join the chat at https://gitter.im/bonukai/MediaTracker](https://badges.gitter.im/bonukai/MediaTracker.svg)](https://gitter.im/bonukai/MediaTracker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Crowdin](https://badges.crowdin.net/mediatracker/localized.svg)](https://crowdin.com/project/mediatracker) [![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/bonukai/mediatracker)](https://hub.docker.com/r/bonukai/mediatracker) [![Docker Pulls](https://img.shields.io/docker/pulls/bonukai/mediatracker)](https://hub.docker.com/r/bonukai/mediatracker) [![CodeFactor](https://www.codefactor.io/repository/github/bonukai/mediatracker/badge)](https://www.codefactor.io/repository/github/bonukai/mediatracker) [![codecov](https://codecov.io/gh/bonukai/MediaTracker/branch/main/graph/badge.svg?token=CPMW6R7M1Z)](https://codecov.io/gh/bonukai/MediaTracker)

Self hosted platform for tracking movies, tv shows, video games, books and audiobooks, highly inspired by [flox](https://github.com/devfake/flox)

# Demo

[mediatracker.app](https://mediatracker.app/)\
Username: **demo**\
Password: **demo**

# API Documentation

[https://bonukai.github.io/MediaTracker/](https://bonukai.github.io/MediaTracker/)

# Installation

## Building from source

```bash
git clone https://github.com/bonukai/MediaTracker.git
cd MediaTracker
npm install
npm run build
npm run start
```

## From npm

```
npm install -g mediatracker
mediatracker
```

Database file, logs and assets will be saved in `$HOME/.mediatracker`

## With docker

## Version Tags

| Tag      | Description     |
| -------- | --------------- |
| latest   | stable releases |
| unstable | pre-releases    |

```bash
docker volume create assets
docker run \
    -d \
    --name mediatracker \
    -p 7481:7481 \
    -v /home/YOUR_HOME_DIRECTORY/.config/mediatracker/data:/storage \
    -v assets:/assets \
    -e TMDB_LANG=en \
    -e AUDIBLE_LANG=us \
    -e TZ=Europe/London \
    bonukai/mediatracker:latest
```

## With docker-compose

```bash
version: "3"
services:
  mediatracker:
    container_name: mediatracker
    ports:
      - 7481:7481
    volumes:
      - /home/YOUR_HOME_DIRECTORY/.config/mediatracker/data:/storage
      - assetsVolume:/assets
    environment:
      SERVER_LANG: en
      TMDB_LANG: en
      AUDIBLE_LANG: us
      TZ: Europe/London
    image: bonukai/mediatracker:latest

volumes:
  assetsVolume: null
```

### Parameters

| Parameter   | Function                |
| ----------- | ----------------------- |
| -p 7481     | Port web API            |
| -v /storage | Directory with database |
| -v /assets  | Posters directory       |
| -v /logs    | Logs directory          |

### Environment variables

| Name               | Description                                                                                                                                                                                                         
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- 
| TMDB_LANG          | ISO 639-1 country code
| AUDIBLE_LANG       | ISO 639-1 country code 
| SERVER_LANG        | ISO 639-1 country code
| DATABASE_CLIENT    | Database client: `better-sqlite3` or `pg`
| DATABASE_PATH      | Only for sqlite, path to database
| DATABASE_URL       | Connection string
| DATABASE_HOST      | Database host
| DATABASE_PORT      | Database port
| DATABASE_USER      | Database user
| DATABASE_PASSWORD  | Database password
| DATABASE_DATABASE  | Database name
| IGDB_CLIENT_ID     | IGDB API key, needed for game lookup
| IGDB_CLIENT_SECRET | IGDB secret
| PUID               | UserID
| PGID               | GroupID
| TZ                 | Timezone
| ASSETS_PATH        | Directory for posters and backdrops
| LOGS_PATH          | Directory for logs
| HOSTNAME           | IP address that the server will listen on
| PORT               | Port that the server will listen on

## Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# Building docker image

```bash
docker build --tag mediatracker:latest https://github.com/bonukai/MediaTracker.git
docker run -p 7481:7481 mediatracker
```

# Features

-   notifications
-   calendar
-   multiple users
-   REST API
-   watchlist
-   docker image
-   import from [Trakt](https://trakt.tv)
-   import from [goodreads](https://www.goodreads.com)

# Import

| Service                                | Imported data                                  |
| -------------------------------------- | ---------------------------------------------- |
| [Trakt](https://trakt.tv)              | Watchlist, watched history, ratings            |
| [goodreads](https://www.goodreads.com) | Read, Currently Reading, Want to Read, ratings |

# Metadata providers

| Provider                                                                       | Media type     | Localization |
| ------------------------------------------------------------------------------ | -------------- | :----------: |
| [TMDB](https://www.themoviedb.org/)                                            | movie, tv show |      ✓       |
| [IGDB](https://www.igdb.com/)\*                                                | video game     |      ✗       |
| [Audible API](https://audible.readthedocs.io/en/latest/misc/external_api.html) | audiobooks     |      ✓       |
| [Open Library](https://openlibrary.org/)                                       | books          |      ✗       |

\* IGDB has a limit of 4 requests per second. Because of that IGDB API key is not provided with MediaTracker, it can be acquired [here](https://api-docs.igdb.com/#account-creation) and set in [http://localhost:7481/#/settings/configuration](http://localhost:7481/#/settings/configuration)

# Notification platforms

-   [gotify](https://gotify.net)
-   [ntfy](https://ntfy.sh)
-   [Pushbullet](https://www.pushbullet.com)
-   [Discord](https://discord.com)
-   [Pushover](https://pushover.net)
-   [Pushsafer](https://www.pushsafer.com)

# Integrations

-   [Jellyfin](https://jellyfin.org/) - [Plugin](https://github.com/bonukai/jellyfin-plugin-mediatracker), minimum MediaTracker version: `0.1.0`
-   [Plex](https://www.plex.tv/) - Generate Application token in your MediaTracker instance, and add a [webhook](https://app.plex.tv/desktop/#!/settings/webhooks) in plex `[your MediaTracker url]/api/plex?token=[MediaTracker Application Token]`
-   [Kodi](https://kodi.tv/) - [Plugin](https://github.com/bonukai/script.mediatracker), minimum MediaTracker version: `0.1.0`

# Contributors

-   [URBANsUNITED](https://github.com/URBANsUNITED) (German translation)

# Similar projects

-   [devfake/flox](https://github.com/devfake/flox)
-   [FuzzyGrim/Yamtrack](https://github.com/FuzzyGrim/Yamtrack)
-   [IgnisDa/ryot](https://github.com/IgnisDa/ryot)
-   [krateng/maloja](https://github.com/krateng/maloja)
-   [leepeuker/movary](https://github.com/leepeuker/movary)
-   [MaarifaMaarifa/series-troxide](https://github.com/MaarifaMaarifa/series-troxide)
-   [sbondCo/Watcharr](https://github.com/sbondCo/Watcharr)

</details>
