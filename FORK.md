# Fork Information

## About This Fork

This repository is a **UI/UX-focused fork** of [MediaTracker](https://github.com/bonukai/MediaTracker) by [bonukai](https://github.com/bonukai).

### Original Project
- **Repository:** https://github.com/bonukai/MediaTracker
- **Author:** [@bonukai](https://github.com/bonukai)
- **License:** MIT
- **Description:** Self-hosted platform for tracking movies, TV shows, video games, books, and audiobooks

### This Fork
- **Repository:** https://github.com/GrowlerGary/MediaTracker
- **Fork Author:** [@GrowlerGary](https://github.com/GrowlerGary)
- **Focus:** UI/UX improvements and modern design
- **License:** MIT (same as original)

## What Was Changed

### UI/UX Enhancements
1. **Design System** — Complete Tailwind CSS configuration with consistent colors, spacing, and typography
2. **Loading States** — Skeleton screen components for better perceived performance
3. **Empty States** — Beautiful, helpful empty state components with actionable guidance
4. **Glass Morphism** — Modern glass-effect cards and navigation elements
5. **Navigation** — Sticky header with scroll-based effects and improved mobile menu
6. **Media Cards** — Enhanced hover effects, progress bars, and quick actions
7. **Search & Pagination** — Improved UI with better visual feedback
8. **Home Dashboard** — Statistics summary and quick action cards

### What Was NOT Changed
- ✅ All original features preserved
- ✅ API compatibility maintained
- ✅ Database structure unchanged
- ✅ Docker compatibility maintained
- ✅ Import/export functionality intact
- ✅ All integrations (Jellyfin, Plex, Kodi) work as before

## Switching Between Fork and Original

Since this fork maintains full compatibility with the original, you can switch between them at any time:

### From Original to This Fork
```bash
# Just change the image in docker-compose.yml
# From: bonukai/mediatracker:latest
# To: ghcr.io/growlergary/mediatracker:latest

docker-compose pull
docker-compose up -d
```

### From This Fork to Original
```bash
# Change the image back to original
docker pull bonukai/mediatracker:latest
docker-compose up -d
```

Your data remains intact regardless of which image you use.

## Contributing

### To This Fork
Issues and PRs for UI/UX improvements are welcome in this repository.

### To the Original Project
For bug reports, feature requests, or contributions to the core functionality, please use the [original repository](https://github.com/bonukai/MediaTracker).

## Support

### This Fork
- GitHub Issues: https://github.com/GrowlerGary/MediaTracker/issues

### Original Project
- GitHub Issues: https://github.com/bonukai/MediaTracker/issues
- Gitter Chat: https://gitter.im/bonukai/MediaTracker

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE.md) file for details.

The original MediaTracker project is also MIT licensed and copyright (c) bonukai.
