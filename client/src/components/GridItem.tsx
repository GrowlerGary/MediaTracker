import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { t, Trans } from '@lingui/macro';
import { parseISO } from 'date-fns';
import clsx from 'clsx';

import { removeFromWatchlist } from 'src/api/details';
import { BadgeRating } from 'src/components/StarRating';
import { Tooltip, MediaBadge } from 'src/components/GlassCard';

import {
  formatEpisodeNumber,
  formatSeasonNumber,
  hasBeenReleased,
  hasProgress,
  isTvShow,
} from 'src/utils';
import { FormatDuration, RelativeTime } from 'src/components/date';
import {
  MediaItemItemsResponse,
  MediaType,
  TvEpisode,
  TvSeason,
} from 'mediatracker-api';
import { Poster } from 'src/components/Poster';
import { AddToSeenHistoryButton } from 'src/components/AddAndRemoveFromSeenHistoryButton';
import { AddToWatchlistButton } from 'src/pages/Details';
import { Confirm } from 'src/components/Confirm';

export type GridItemAppearanceArgs = {
  showNextAiring?: boolean;
  showLastAiring?: boolean;
  showFirstUnwatchedEpisode?: boolean;
  showRating?: boolean;
  showAddToWatchlistAndMarkAsSeenButtons?: boolean;
  showMarksAsSeenFirstUnwatchedEpisode?: boolean;
  showMarksAsSeenLastAiredEpisode?: boolean;
  showTotalRuntime?: boolean;
  showReleaseDate?: boolean;
  showLastSeenAt?: boolean;
  topBar?: {
    showOnWatchlistIcon?: boolean;
    showUnwatchedEpisodesCount?: boolean;
    showFirstUnwatchedEpisodeBadge?: boolean;
  };
};

export const GridItem: FunctionComponent<{
  mediaItem: MediaItemItemsResponse;
  season?: TvSeason;
  episode?: TvEpisode;
  mediaType?: MediaType;
  removeFromListButton?: {
    listId: number;
    listTitle: string;
  };
  appearance?: GridItemAppearanceArgs;
  className?: string;
}> = (props) => {
  const { mediaItem, season, episode, mediaType, className } = props;
  const {
    topBar,
    showNextAiring,
    showLastAiring,
    showMarksAsSeenFirstUnwatchedEpisode,
    showMarksAsSeenLastAiredEpisode,
    showRating,
    showAddToWatchlistAndMarkAsSeenButtons,
    showTotalRuntime,
    showReleaseDate,
    showLastSeenAt,
  } = props.appearance || {};

  const [isHovered, setIsHovered] = useState(false);

  const item = episode || season || mediaItem;

  const isOnWatchlist =
    (season && season.onWatchlist) ||
    (episode && episode.onWatchlist) ||
    (!episode && !season && mediaItem.onWatchlist);

  const mediaTypeString: Record<MediaType, string> = {
    audiobook: t`Audiobook`,
    book: t`Book`,
    movie: t`Movie`,
    tv: t`TV`,
    video_game: t`Game`,
  };

  const mediaTypeIcon: Record<MediaType, string> = {
    audiobook: 'headphones',
    book: 'menu_book',
    movie: 'movie',
    tv: 'tv',
    video_game: 'sports_esports',
  };

  if (season && episode) {
    throw new Error('Both season and episode cannot be provided');
  }

  if (season && season.tvShowId !== mediaItem.id) {
    throw new Error('Season needs to be from the same tv show as mediaItem');
  }

  if (episode && episode.tvShowId !== mediaItem.id) {
    throw new Error('Episode needs to be from the same tv show as mediaItem');
  }

  const href = season
    ? `#/seasons/${mediaItem.id}/${season.seasonNumber}`
    : episode
    ? `#/episode/${mediaItem.id}/${episode.seasonNumber}/${episode.episodeNumber}`
    : `#/details/${mediaItem.id}`;

  return (
    <div
      className={clsx(
        'group relative pb-4 animate-fade-in',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pb-4 transition-transform duration-300 ease-spring group-hover:-translate-y-1">
        {/* Poster with overlays */}
        <div className="relative">
          <Poster
            src={mediaItem.posterSmall}
            mediaType={mediaType}
            itemMediaType={mediaItem.mediaType}
            href={href}
          >
            {/* Top bar badges */}
            {topBar && (
              <>
                {/* Watchlist indicator */}
                {topBar.showOnWatchlistIcon && isOnWatchlist && (
                  <div className="absolute top-2 left-2">
                    <Tooltip content={t`On watchlist`}>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          if (
                            await Confirm(
                              t`Remove "${mediaItem.title}${
                                season
                                  ? ' ' + formatSeasonNumber(season)
                                  : episode
                                  ? ' ' + formatEpisodeNumber(episode)
                                  : ''
                              }" from watchlist?`
                            )
                          ) {
                            removeFromWatchlist({ mediaItem, season, episode });
                          }
                        }}
                        className="p-1.5 rounded-full bg-accent-500 text-white shadow-lg hover:bg-accent-600 transition-colors"
                      >
                        <span className="material-icons text-sm">bookmark</span>
                      </button>
                    </Tooltip>
                  </div>
                )}

                {/* Unwatched count / Episode badge */}
                {isTvShow(mediaItem) ? (
                  <a
                    className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-auto"
                    href={`#/seasons/${mediaItem.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {topBar.showFirstUnwatchedEpisodeBadge &&
                      mediaItem.firstUnwatchedEpisode && (
                        <MediaBadge
                          icon="play_arrow"
                          text={formatEpisodeNumber(mediaItem.firstUnwatchedEpisode)}
                          variant="primary"
                        />
                      )}
                    {topBar.showUnwatchedEpisodesCount &&
                      mediaItem.unseenEpisodesCount > 0 && (
                        <MediaBadge
                          icon="visibility_off"
                          text={mediaItem.unseenEpisodesCount}
                          variant="accent"
                        />
                      )}
                    {topBar.showUnwatchedEpisodesCount && mediaItem.seen === true && (
                      <MediaBadge
                        icon="check_circle"
                        text={t`Seen`}
                        variant="success"
                      />
                    )}
                  </a>
                ) : (
                  <>
                    {topBar.showUnwatchedEpisodesCount && mediaItem.seen === true && (
                      <div className="absolute top-2 right-2">
                        <MediaBadge
                          icon="check_circle"
                          text={t`Seen`}
                          variant="success"
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Rating badge */}
            {showRating && hasBeenReleased(mediaItem) && (
              <div className="absolute bottom-2 left-2">
                <BadgeRating
                  mediaItem={mediaItem}
                  season={season}
                  episode={episode}
                />
              </div>
            )}

            {/* Hover overlay with quick actions */}
            <div
              className={clsx(
                'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded transition-opacity duration-200 flex flex-col justify-end p-3',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
            >
              {showAddToWatchlistAndMarkAsSeenButtons && !isOnWatchlist && (
                <div className="flex flex-col gap-2">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="btn-primary btn-sm justify-center text-xs"
                  >
                    <AddToWatchlistButton
                      mediaItem={mediaItem}
                      season={season}
                      episode={episode}
                    />
                  </div>
                  {hasBeenReleased(mediaItem) && (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="btn-success btn-sm justify-center text-xs"
                    >
                      <AddToSeenHistoryButton
                        mediaItem={mediaItem}
                        season={season}
                        episode={episode}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Poster>
        </div>

        {/* Content info */}
        <div className="mt-3 space-y-1">
          {/* Meta row: Year & Media Type */}
          <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
            <span className="flex items-center gap-1">
              <span className="material-icons text-[14px]">{mediaTypeIcon[mediaItem.mediaType]}</span>
              {mediaTypeString[mediaItem.mediaType]}
            </span>
            {mediaItem.releaseDate && (
              <span>{parseISO(mediaItem.releaseDate).getFullYear()}</span>
            )}
          </div>

          {/* Title */}
          <a
            href={href}
            className="block text-base font-semibold text-surface-900 dark:text-surface-100 leading-tight line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title={`${season ? formatSeasonNumber(season) + ' ' : ''}${episode ? formatEpisodeNumber(episode) + ' ' : ''}${mediaItem.title}`}
          >
            {season && <span className="text-surface-500 dark:text-surface-400">{formatSeasonNumber(season)} </span>}
            {episode && <span className="text-surface-500 dark:text-surface-400">{formatEpisodeNumber(episode)} </span>}
            {mediaItem.title}
          </a>

          {/* Progress bar */}
          {hasProgress(mediaItem) && (
            <div className="pt-1">
              <div className="w-full h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{ width: `${mediaItem.progress * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Next airing */}
          {showNextAiring && (
            <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1">
              <span className="material-icons text-[14px] text-accent-500">event_upcoming</span>
              {mediaItem.mediaType === 'tv' && mediaItem.upcomingEpisode ? (
                <>
                  {formatEpisodeNumber(mediaItem.upcomingEpisode)}{' '}
                  <RelativeTime to={parseISO(mediaItem.upcomingEpisode.releaseDate)} />
                </>
              ) : (
                mediaItem.releaseDate && (
                  <Trans>
                    Release <RelativeTime to={parseISO(mediaItem.releaseDate)} />
                  </Trans>
                )
              )}
            </div>
          )}

          {/* Last airing */}
          {showLastAiring && (
            <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1">
              <span className="material-icons text-[14px] text-success-500">update</span>
              {mediaItem.mediaType === 'tv' && mediaItem.lastAiredEpisode ? (
                <>
                  {formatEpisodeNumber(mediaItem.lastAiredEpisode)}{' '}
                  <RelativeTime to={parseISO(mediaItem.lastAiredEpisode.releaseDate)} />
                </>
              ) : (
                mediaItem.releaseDate && (
                  <Trans>
                    Released <RelativeTime to={parseISO(mediaItem.releaseDate)} />
                  </Trans>
                )
              )}
            </div>
          )}

          {/* Total runtime */}
          {showTotalRuntime && (
            <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1">
              <span className="material-icons text-[14px]">schedule</span>
              <FormatDuration
                milliseconds={
                  (episode
                    ? episode.runtime || mediaItem.runtime
                    : season
                    ? season.totalRuntime
                    : mediaItem.totalRuntime) *
                  60 *
                  1000
                }
              />
            </div>
          )}

          {/* Release date */}
          {showReleaseDate && item.releaseDate && (
            <div className="text-xs text-surface-500 dark:text-surface-400">
              {new Date(item.releaseDate).toLocaleDateString()}
            </div>
          )}

          {/* Last seen */}
          {showLastSeenAt && item.lastSeenAt && (
            <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1">
              <span className="material-icons text-[14px] text-success-500">visibility</span>
              {new Date(item.lastSeenAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {showMarksAsSeenFirstUnwatchedEpisode &&
          (!isTvShow(mediaItem) ||
            (isTvShow(mediaItem) && mediaItem.firstUnwatchedEpisode)) && (
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <AddToSeenHistoryButton
                mediaItem={mediaItem}
                episode={mediaItem.firstUnwatchedEpisode}
                useSeasonAndEpisodeNumber={true}
                className="w-full btn-primary btn-sm justify-center"
              />
            </div>
          )}

        {showMarksAsSeenLastAiredEpisode &&
          (!isTvShow(mediaItem) ||
            (isTvShow(mediaItem) && mediaItem.lastAiredEpisode)) && (
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <AddToSeenHistoryButton
                mediaItem={mediaItem}
                episode={mediaItem.lastAiredEpisode}
                useSeasonAndEpisodeNumber={true}
                className="w-full btn-primary btn-sm justify-center"
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default GridItem;
