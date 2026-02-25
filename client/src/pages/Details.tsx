import React, { FunctionComponent } from 'react';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Plural, Trans } from '@lingui/macro';
import { parseISO } from 'date-fns';

import {
  AudibleCountryCode,
  MediaItemDetailsResponse,
  MediaItemItemsResponse,
  TvEpisode,
  TvSeason,
  UserRating,
} from 'mediatracker-api';
import { SelectSeenDate } from 'src/components/SelectSeenDate';
import { BadgeRating } from 'src/components/StarRating';
import {
  canMetadataBeUpdated,
  formatEpisodeNumber,
  hasBeenReleased,
  hasProgress,
  hasReleaseDate,
  isAudiobook,
  isBook,
  isMovie,
  isOnWatchlist,
  isTvShow,
  isVideoGame,
} from 'src/utils';
import {
  addToProgress,
  addToWatchlist,
  removeFromWatchlist,
  useDetails,
  useUpdateMetadata,
} from 'src/api/details';
import { FormatDuration, RelativeTime } from 'src/components/date';
import { Poster } from 'src/components/Poster';
import { Modal } from 'src/components/Modal';
import { useOtherUser } from 'src/api/user';
import { SetProgressComponent } from 'src/components/SetProgress';
import { useConfiguration } from 'src/api/configuration';
import { AddToListButtonWithModal } from 'src/components/AddToListModal';
import {
  AddToSeenHistoryButton,
  RemoveFromSeenHistoryButton,
} from 'src/components/AddAndRemoveFromSeenHistoryButton';
import { hasBeenSeenAtLeastOnce } from 'src/mediaItem';
import { DetailPageSkeleton } from 'src/components/Skeleton';
import { ErrorState } from 'src/components/EmptyState';
import { GlassCard, ProgressBar } from 'src/components/GlassCard';

const Review: FunctionComponent<{ userRating: UserRating }> = (props) => {
  const { userRating } = props;
  const { user, isLoading } = useOtherUser(userRating.userId);

  if (isLoading) {
    return <div className="h-20 skeleton rounded-lg" />;
  }

  const date = new Date(userRating.date).toLocaleDateString();
  const author = user?.name || t`Unknown`;

  return (
    <GlassCard className="mb-4" variant="subtle">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <span className="material-icons text-primary-600 dark:text-primary-400">person</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-surface-900 dark:text-white">{author}</span>
            <span className="text-xs text-surface-500">{date}</span>
          </div>
          {userRating.rating && (
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    'material-icons text-sm',
                    i < userRating.rating
                      ? 'text-yellow-400'
                      : 'text-surface-300 dark:text-surface-600'
                  )}
                >
                  star
                </span>
              ))}
            </div>
          )}
          <p className="text-surface-700 dark:text-surface-300 whitespace-pre-wrap">{userRating.review}</p>
        </div>
      </div>
    </GlassCard>
  );
};

const RatingAndReview: FunctionComponent<{
  userRating: UserRating;
  mediaItem: MediaItemItemsResponse;
  season?: TvSeason;
  episode?: TvEpisode;
}> = (props) => {
  const { userRating, mediaItem, season, episode } = props;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <BadgeRating mediaItem={mediaItem} season={season} episode={episode} />
        <span className="text-surface-500 dark:text-surface-400">
          <Trans>Click to rate</Trans>
        </span>
      </div>

      {userRating?.review && <Review userRating={userRating} />}
    </div>
  );
};

const IconWithLink: FunctionComponent<{
  href: string;
  src: string;
  whiteLogo?: boolean;
  label: string;
}> = (props) => {
  const { href, src, whiteLogo, label } = props;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors group"
      title={label}
    >
      <img
        src={src}
        alt={label}
        className={clsx(
          'h-5 w-auto object-contain transition-opacity group-hover:opacity-80',
          whiteLogo && 'invert dark:invert-0'
        )}
      />
    </a>
  );
};

const audibleLanguages: Record<AudibleCountryCode, string> = {
  au: 'au',
  ca: 'ca',
  de: 'de',
  fr: 'fr',
  in: 'in',
  it: 'it',
  es: 'es',
  jp: 'co.jp',
  uk: 'co.uk',
  us: 'com',
};

const ExternalLinks: FunctionComponent<{
  mediaItem: MediaItemDetailsResponse;
}> = (props) => {
  const { mediaItem } = props;
  const { configuration } = useConfiguration();

  const audibleDomain =
    audibleLanguages[
      mediaItem.audibleCountryCode || configuration.audibleLang?.toLowerCase()
    ] || 'com';

  const links = [
    mediaItem.imdbId && {
      href: `https://www.imdb.com/title/${mediaItem.imdbId}`,
      src: 'logo/imdb.png',
      label: 'IMDb',
    },
    mediaItem.tmdbId && {
      href: `https://www.themoviedb.org/${mediaItem.mediaType}/${mediaItem.tmdbId}`,
      src: 'logo/tmdb.svg',
      label: 'TMDB',
    },
    mediaItem.igdbId && {
      href: `https://www.igdb.com/games/${mediaItem.title
        .toLowerCase()
        .replaceAll(' ', '-')}`,
      src: 'logo/igdb.png',
      label: 'IGDB',
      whiteLogo: true,
    },
    mediaItem.openlibraryId && {
      href: `https://openlibrary.org${mediaItem.openlibraryId}`,
      src: 'logo/openlibrary.svg',
      label: 'Open Library',
    },
    mediaItem.audibleId && {
      href: `https://audible.${audibleDomain}/pd/${mediaItem.audibleId}?overrideBaseCountry=true&ipRedirectOverride=true`,
      src: 'logo/audible.png',
      label: 'Audible',
    },
  ].filter(Boolean);

  if (links.length === 0) return null;

  return (
    <GlassCard className="inline-flex items-center gap-1" padding="sm">
      <span className="text-xs text-surface-500 dark:text-surface-400 px-2">
        <Trans>External links:</Trans>
      </span>
      {links.map((link) => (
        <IconWithLink key={link.label} {...link} />
      ))}
    </GlassCard>
  );
};

export const DetailsPage: FunctionComponent = () => {
  const { mediaItemId } = useParams();
  const { mediaItem, isLoading, error } = useDetails(Number(mediaItemId));

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (error || !mediaItem) {
    return (
      <ErrorState
        title={<Trans>Failed to load details</Trans>}
        description={error || <Trans>The media item could not be found.</Trans>}
      />
    );
  }

  const mediaTypeIcons: Record<MediaType, string> = {
    movie: 'movie',
    tv: 'tv',
    book: 'menu_book',
    audiobook: 'headphones',
    video_game: 'sports_esports',
  };

  const mediaTypeLabels: Record<MediaType, string> = {
    movie: t`Movie`,
    tv: t`TV Show`,
    book: t`Book`,
    audiobook: t`Audiobook`,
    video_game: t`Video Game`,
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Poster */}
        <div className="self-center md:self-start w-48 sm:w-56 md:w-64 shrink-0">
          <Poster
            src={mediaItem.poster}
            mediaType={mediaItem.mediaType}
            itemMediaType={mediaItem.mediaType}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-primary flex items-center gap-1">
              <span className="material-icons text-[12px]">{mediaTypeIcons[mediaItem.mediaType]}</span>
              {mediaTypeLabels[mediaItem.mediaType]}
            </span>
            {mediaItem.releaseDate && (
              <span className="badge badge-neutral">
                {parseISO(mediaItem.releaseDate).getFullYear()}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            {mediaItem.title}
          </h1>

          {/* Metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
            {mediaItem.releaseDate && (
              <MetadataItem
                label={t`Release date`}
                value={parseISO(mediaItem.releaseDate).toLocaleDateString()}
              />
            )}

            {mediaItem.runtime > 0 && (
              <MetadataItem
                label={t`Runtime`}
                value={<FormatDuration milliseconds={mediaItem.runtime * 60 * 1000} />}
              />
            )}

            {mediaItem.totalRuntime > 0 && (
              <MetadataItem
                label={t`Total runtime`}
                value={<FormatDuration milliseconds={mediaItem.totalRuntime * 60 * 1000} />}
              />
            )}

            {mediaItem.platform?.length > 0 && (
              <MetadataItem
                label={<Plural value={mediaItem.platform.length} one="Platform" other="Platforms" />}
                value={mediaItem.platform.sort().join(', ')}
              />
            )}

            {mediaItem.network && (
              <MetadataItem label={t`Network`} value={mediaItem.network} />
            )}

            {mediaItem.status && (
              <MetadataItem label={t`Status`} value={mediaItem.status} />
            )}

            {mediaItem.genres?.length > 0 && (
              <MetadataItem
                label={<Plural value={mediaItem.genres.length} one="Genre" other="Genres" />}
                value={
                  <div className="flex flex-wrap gap-1">
                    {mediaItem.genres.sort().map((genre) => (
                      <span key={genre} className="badge badge-neutral">{genre}</span>
                    ))}
                  </div>
                }
              />
            )}

            {mediaItem.language && (
              <MetadataItem label={t`Language`} value={mediaItem.language} />
            )}

            {mediaItem.authors?.length > 0 && (
              <MetadataItem
                label={<Plural value={mediaItem.authors.length} one="Author" other="Authors" />}
                value={mediaItem.authors.sort().join(', ')}
              />
            )}

            {mediaItem.narrators?.length > 0 && (
              <MetadataItem
                label={<Plural value={mediaItem.narrators.length} one="Narrator" other="Narrators" />}
                value={mediaItem.narrators.sort().join(', ')}
              />
            )}

            {mediaItem.numberOfPages && (
              <MetadataItem label={t`Pages`} value={mediaItem.numberOfPages} />
            )}

            {isTvShow(mediaItem) && (
              <>
                <MetadataItem label={t`Seasons`} value={mediaItem.numberOfSeasons} />
                <MetadataItem label={t`Episodes`} value={mediaItem.numberOfEpisodes} />
                {mediaItem.unseenEpisodesCount > 0 && (
                  <MetadataItem
                    label={t`Unseen`}
                    value={<span className="text-accent-600 dark:text-accent-400 font-medium">{mediaItem.unseenEpisodesCount}</span>}
                  />
                )}
              </>
            )}

            <MetadataItem label={t`Source`} value={mediaItem.source} />
          </div>

          {/* Overview */}
          {mediaItem.overview && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">
                <Trans>Overview</Trans>
              </h3>
              <p className="text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
                {mediaItem.overview}
              </p>
            </div>
          )}

          {/* External links */}
          <div className="mb-6">
            <ExternalLinks mediaItem={mediaItem} />
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <GlassCard className="mb-6" padding="md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Watchlist button */}
          {isOnWatchlist(mediaItem) ? (
            <RemoveFromWatchlistButton mediaItem={mediaItem} />
          ) : (
            <AddToWatchlistButton mediaItem={mediaItem} />
          )}

          {/* Seen buttons */}
          {(hasBeenReleased(mediaItem) || !hasReleaseDate(mediaItem)) && (
            <>
              <AddToSeenHistoryButton mediaItem={mediaItem} />
              {hasBeenSeenAtLeastOnce(mediaItem) && (
                <RemoveFromSeenHistoryButton mediaItem={mediaItem} />
              )}
            </>
          )}

          <AddToListButtonWithModal mediaItemId={mediaItem.id} />

          {canMetadataBeUpdated(mediaItem) && (
            <UpdateMetadataButton mediaItem={mediaItem} />
          )}
        </div>
      </GlassCard>

      {/* Progress Section */}
      {(hasBeenReleased(mediaItem) || !hasReleaseDate(mediaItem)) &&
        !isTvShow(mediaItem) && (
        <div className="mb-6">
          {!hasProgress(mediaItem) ? (
            <GlassCard
              className="cursor-pointer hover:shadow-soft-lg transition-shadow"
              onClick={() => addToProgress({ mediaItemId: mediaItem.id, progress: 0 })}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-primary-600 dark:text-primary-400">play_circle</span>
                  <span className="font-medium">
                    {isMovie(mediaItem) && <Trans>I'm watching this</Trans>}
                    {isBook(mediaItem) && <Trans>I'm reading this</Trans>}
                    {isAudiobook(mediaItem) && <Trans>I'm listening to this</Trans>}
                    {isVideoGame(mediaItem) && <Trans>I'm playing this</Trans>}
                  </span>
                </div>
                <span className="material-icons text-surface-400">chevron_right</span>
              </div>
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-success-600 dark:text-success-400">
                      {mediaItem.progress >= 1 ? 'check_circle' : 'pending'}
                    </span>
                    <span className="font-medium">
                      {mediaItem.progress >= 1 ? (
                        <>
                          {isMovie(mediaItem) && <Trans>Finished watching</Trans>}
                          {isBook(mediaItem) && <Trans>Finished reading</Trans>}
                          {isAudiobook(mediaItem) && <Trans>Finished listening</Trans>}
                          {isVideoGame(mediaItem) && <Trans>Finished playing</Trans>}
                        </>
                      ) : (
                        <>
                          {isMovie(mediaItem) && <Trans>In progress</Trans>}
                          {isBook(mediaItem) && <Trans>Reading</Trans>}
                          {isAudiobook(mediaItem) && <Trans>Listening</Trans>}
                          {isVideoGame(mediaItem) && <Trans>Playing</Trans>}
                        </>
                      )}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">
                    {Math.round(mediaItem.progress * 100)}%
                  </span>
                </div>

                <ProgressBar
                  progress={mediaItem.progress}
                  size="lg"
                  variant={mediaItem.progress >= 1 ? 'success' : 'primary'}
                />

                <div className="flex flex-wrap gap-2">
                  <SetProgressButton mediaItem={mediaItem} />
                  {mediaItem.progress < 1 && (
                    <button
                      onClick={() => addToProgress({ mediaItemId: mediaItem.id, progress: 1 })}
                      className="btn-success btn-sm"
                    >
                      <span className="material-icons text-sm">check</span>
                      <Trans>Mark complete</Trans>
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Episodes link for TV */}
      {mediaItem.mediaType === 'tv' && (
        <GlassCard className="mb-6" hover
          onClick={() => window.location.href = `#/seasons/${mediaItem.id}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-icons text-primary-600 dark:text-primary-400">episode</span>
              <div>
                <div className="font-medium"><Trans>Episodes</Trans></div>
                <div className="text-sm text-surface-500">
                  {mediaItem.numberOfSeasons} seasons, {mediaItem.numberOfEpisodes} episodes
                </div>
              </div>
            </div>
            <span className="material-icons text-surface-400">chevron_right</span>
          </div>
        </GlassCard>
      )}

      {/* Upcoming Episode */}
      {mediaItem.upcomingEpisode && (
        <GlassCard className="mb-6 border-l-4 border-l-accent-500">
          <div className="flex items-start gap-3">
            <span className="material-icons text-accent-500">event_upcoming</span>
            <div>
              <div className="font-medium">
                <Trans>Next Episode</Trans>
                {mediaItem.upcomingEpisode.releaseDate && (
                  <span className="text-accent-600 dark:text-accent-400 ml-2">
                    (<RelativeTime to={parseISO(mediaItem.upcomingEpisode.releaseDate)} />)
                  </span>
                )}
              </div>
              <div className="text-lg font-semibold">
                {formatEpisodeNumber(mediaItem.upcomingEpisode)} {mediaItem.upcomingEpisode.title}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* First Unwatched */}
      {mediaItem.firstUnwatchedEpisode && (
        <GlassCard className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-icons text-primary-600 dark:text-primary-400">play_circle</span>
              <div>
                <div className="text-sm text-surface-500"><Trans>Next to watch</Trans></div>
                <div className="font-semibold">
                  {formatEpisodeNumber(mediaItem.firstUnwatchedEpisode)} {mediaItem.firstUnwatchedEpisode.title}
                </div>
              </div>
            </div>
            <MarkAsSeenFirstUnwatchedEpisode mediaItem={mediaItem} />
          </div>
        </GlassCard>
      )}

      {/* History */}
      {mediaItem.lastSeenAt > 0 && (
        <GlassCard className="mb-6">
          <div className="flex items-center gap-3">
            <span className="material-icons text-success-600 dark:text-success-400">history</span>
            <div>
              <div className="text-sm text-surface-500">
                {isAudiobook(mediaItem) && <Trans>Last listened</Trans>}
                {isBook(mediaItem) && <Trans>Last read</Trans>}
                {(isMovie(mediaItem) || isTvShow(mediaItem)) && <Trans>Last watched</Trans>}
                {isVideoGame(mediaItem) && <Trans>Last played</Trans>}
              </div>
              <div>{new Date(mediaItem.lastSeenAt).toLocaleString()}</div>            </div>
          </div>
          {mediaItem.seenHistory?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
              <Link
                to={`/seen-history/${mediaItem.id}`}
                className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                <Plural
                  value={mediaItem.seenHistory.length}
                  one="View 1 entry"
                  other="View # entries"
                />
                <span className="material-icons text-sm">open_in_new</span>
              </Link>
            </div>
          )}
        </GlassCard>
      )}

      {/* Rating */}
      {(hasBeenReleased(mediaItem) || !hasReleaseDate(mediaItem)) && (
        <GlassCard className="mb-6">
          <RatingAndReview
            userRating={mediaItem.userRating}
            mediaItem={mediaItem}
          />
        </GlassCard>
      )}
    </div>
  );
};

// Helper component for metadata items
const MetadataItem: FunctionComponent<{
  label: React.ReactNode;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide">{label}</span>
    <span className="text-surface-900 dark:text-surface-100">{value}</span>
  </div>
);

// Action button components
export const AddToWatchlistButton: FunctionComponent<{
  mediaItem: MediaItemItemsResponse;
  season?: TvSeason;
  episode?: TvEpisode;
}> = (props) => {
  const { mediaItem, season, episode } = props;

  return (
    <button
      onClick={() => addToWatchlist({ mediaItem, season, episode })}
      className="btn-accent"
    >
      <span className="material-icons">bookmark_add</span>
      <Trans>Add to watchlist</Trans>
    </button>
  );
};

export const RemoveFromWatchlistButton: FunctionComponent<{
  mediaItem: MediaItemItemsResponse;
  season?: TvSeason;
  episode?: TvEpisode;
}> = (props) => {
  const { mediaItem, season, episode } = props;

  return (
    <button
      onClick={() => removeFromWatchlist({ mediaItem, season, episode })}
      className="btn-ghost text-accent-600 dark:text-accent-400"
    >
      <span className="material-icons">bookmark_remove</span>
      <Trans>Remove from watchlist</Trans>
    </button>
  );
};

const UpdateMetadataButton: FunctionComponent<{
  mediaItem: MediaItemItemsResponse;
}> = (props) => {
  const { mediaItem } = props;
  const { updateMetadata, isLoading } = useUpdateMetadata(mediaItem.id);

  return (
    <button
      onClick={() => updateMetadata()}
      disabled={isLoading}
      className="btn-outline"
    >
      <span className={clsx('material-icons', isLoading && 'animate-spin-slow')}>
        {isLoading ? 'sync' : 'refresh'}
      </span>
      <Trans>Update metadata</Trans>
    </button>
  );
};

const SetProgressButton: FunctionComponent<{
  mediaItem: MediaItemDetailsResponse;
}> = (props) => {
  const { mediaItem } = props;

  return (
    <Modal
      openModal={(openModal) => (
        <button onClick={openModal} className="btn-primary btn-sm">
          <span className="material-icons text-sm">edit</span>
          <Trans>Update progress</Trans>
        </button>
      )}
    >
      {(closeModal) => (
        <SetProgressComponent mediaItem={mediaItem} closeModal={closeModal} />
      )}
    </Modal>
  );
};

const MarkAsSeenFirstUnwatchedEpisode: FunctionComponent<{
  mediaItem: MediaItemDetailsResponse;
}> = (props) => {
  const { mediaItem } = props;

  return (
    <Modal
      openModal={(openModal) => (
        <button
          onClick={openModal}
          className="btn-success btn-sm"
        >
          <span className="material-icons text-sm">check</span>
          <Trans>Mark seen</Trans>
        </button>
      )}
    >
      {(closeModal) => (
        <SelectSeenDate
          mediaItem={mediaItem}
          episode={mediaItem.firstUnwatchedEpisode}
          closeModal={closeModal}
        />
      )}
    </Modal>
  );
};

export default DetailsPage;
