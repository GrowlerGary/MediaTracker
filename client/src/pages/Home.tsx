import React, { FunctionComponent } from 'react';
import { t, Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';

import { MediaItemItemsResponse } from 'mediatracker-api';
import { useItems } from 'src/api/items';
import { GridItem, GridItemAppearanceArgs } from 'src/components/GridItem';
import { subDays } from 'date-fns';
import { StatisticsSummary } from 'src/components/StatisticsSummary';
import { EmptyUpcoming, EmptyState } from 'src/components/EmptyState';
import { GridItemsSkeleton, Skeleton } from 'src/components/Skeleton';
import { GlassCard } from 'src/components/GlassCard';
import clsx from 'clsx';

// Section header component
const SectionHeader: FunctionComponent<{
  title: string;
  icon?: string;
  action?: { label: React.ReactNode; href: string };
  count?: number;
}> = ({ title, icon, action, count }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      {icon && (
        <span className="material-icons text-primary-600 dark:text-primary-400 text-2xl">{icon}</span>
      )}
      <h2 className="text-xl font-bold text-surface-900 dark:text-white">{title}</h2>
      {count !== undefined && count > 0 && (
        <span className="badge badge-primary">{count}</span>
      )}
    </div>
    {action && (
      <Link
        to={action.href}
        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors"
      >
        {action.label}
        <span className="material-icons text-lg">chevron_right</span>
      </Link>
    )}
  </div>
);

// Enhanced segment component
const Segment: FunctionComponent<{
  title: string;
  icon?: string;
  items?: MediaItemItemsResponse[];
  gridItemArgs?: GridItemAppearanceArgs;
  action?: { label: React.ReactNode; href: string };
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  maxItems?: number;
}> = (props) => {
  const { title, icon, items, gridItemArgs, action, emptyState, isLoading, maxItems = 5 } = props;

  if (isLoading) {
    return (
      <section className="mb-10 animate-fade-in">
        <SectionHeader title={title} icon={icon} action={action} />
        <div className="flex flex-wrap gap-5">
          <GridItemsSkeleton count={maxItems} />
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return emptyState ? (
      <section className="mb-10">
        <SectionHeader title={title} icon={icon} />
        {emptyState}
      </section>
    ) : null;
  }

  return (
    <section className="mb-10 animate-slide-up">
      <SectionHeader
        title={title}
        icon={icon}
        action={action}
        count={items.length}
      />
      <div className="flex flex-wrap gap-5">
        {items.slice(0, maxItems).map((item, index) => (
          <div
            key={item.id}
            className="w-40"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <GridItem mediaItem={item} appearance={gridItemArgs} />
          </div>
        ))}
      </div>
    </section>
  );
};

export const HomePage: FunctionComponent = () => {
  // Data fetching
  const { items: upcomingEpisodes, isLoading: isLoadingUpcoming } = useItems({
    orderBy: 'nextAiring',
    sortOrder: 'asc',
    page: 1,
    onlyOnWatchlist: true,
    onlyWithNextAiring: true,
  });

  const { items: continueWatching, isLoading: isLoadingContinue } = useItems({
    mediaType: 'tv',
    orderBy: 'lastSeen',
    sortOrder: 'desc',
    page: 1,
    onlyWithNextEpisodesToWatch: true,
    onlyOnWatchlist: true,
  });

  const { items: recentlyReleased, isLoading: isLoadingRecent } = useItems({
    orderBy: 'lastAiring',
    sortOrder: 'desc',
    page: 1,
    onlyOnWatchlist: true,
    onlySeenItems: false,
  });

  const { items: unratedItems, isLoading: isLoadingUnrated } = useItems({
    orderBy: 'lastSeen',
    sortOrder: 'desc',
    page: 1,
    onlySeenItems: true,
    onlyWithoutUserRating: true,
  });

  const { items: inProgressItems, isLoading: isLoadingInProgress } = useItems({
    orderBy: 'lastSeen',
    sortOrder: 'desc',
    page: 1,
    onlyOnWatchlist: true,
  });

  const isLoading =
    isLoadingUpcoming ||
    isLoadingContinue ||
    isLoadingRecent ||
    isLoadingUnrated ||
    isLoadingInProgress;

  return (
    <div className="px-2 pb-8 animate-fade-in">
      {/* Welcome / Stats Section */}
      <section className="mb-8">
        <StatisticsSummary />
      </section>

      {/* Quick Actions */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard
            icon="bookmark_add"
            label={t`Watchlist`}
            href="#/watchlist"
            color="accent"
          />
          <QuickActionCard
            icon="play_circle"
            label={t`In Progress`}
            href="#/in-progress"
            color="primary"
          />
          <QuickActionCard
            icon="event"
            label={t`Calendar`}
            href="#/calendar"
            color="success"
          />
          <QuickActionCard
            icon="download"
            label={t`Import`}
            href="#/import"
            color="neutral"
          />
        </div>
      </section>

      {/* Upcoming Releases */}
      <Segment
        title={t`Upcoming Releases`}
        icon="event_upcoming"
        items={upcomingEpisodes}
        isLoading={isLoadingUpcoming}
        gridItemArgs={{
          showRating: true,
          showNextAiring: true,
          topBar: {
            showFirstUnwatchedEpisodeBadge: true,
            showOnWatchlistIcon: true,
            showUnwatchedEpisodesCount: true,
          },
        }}
        action={{ label: <Trans>View All</Trans>, href: '#/upcoming' }}
        emptyState={<EmptyUpcoming />}
        maxItems={6}
      />

      {/* Continue Watching */}
      <Segment
        title={t`Continue Watching`}
        icon="play_circle"
        items={continueWatching}
        isLoading={isLoadingContinue}
        gridItemArgs={{
          showRating: true,
          showFirstUnwatchedEpisode: true,
          showMarksAsSeenFirstUnwatchedEpisode: true,
          topBar: {
            showFirstUnwatchedEpisodeBadge: true,
            showOnWatchlistIcon: true,
            showUnwatchedEpisodesCount: true,
          },
        }}
        action={{ label: <Trans>All TV Shows</Trans>, href: '#/tv' }}
        emptyState={
          <EmptyState
            icon="tv_off"
            title={<Trans>No shows to continue</Trans>}
            description={<Trans>Start watching a TV show to see it here.</Trans>}
            size="sm"
          />
        }
        maxItems={6}
      />

      {/* Recently Released */}
      <Segment
        title={t`Recently Released`}
        icon="new_releases"
        items={recentlyReleased?.filter(
          (mediaItem) =>
            new Date(mediaItem.lastAiring) > subDays(new Date(), 30)
        )}
        isLoading={isLoadingRecent}
        gridItemArgs={{
          showRating: true,
          showLastAiring: true,
          showMarksAsSeenLastAiredEpisode: true,
          topBar: {
            showFirstUnwatchedEpisodeBadge: true,
            showOnWatchlistIcon: true,
            showUnwatchedEpisodesCount: true,
          },
        }}
        maxItems={6}
      />

      {/* In Progress */}
      <Segment
        title={t`In Progress`}
        icon="pending_actions"
        items={inProgressItems?.filter((item) => item.progress > 0 && item.progress < 1)}
        isLoading={isLoadingInProgress}
        gridItemArgs={{
          showRating: true,
          topBar: {
            showOnWatchlistIcon: true,
          },
        }}
        action={{ label: <Trans>View All</Trans>, href: '#/in-progress' }}
        maxItems={4}
      />

      {/* Unrated */}
      <Segment
        title={t`Rate Your Experience`}
        icon="star_outline"
        items={unratedItems}
        isLoading={isLoadingUnrated}
        gridItemArgs={{
          showRating: true,
          topBar: {
            showFirstUnwatchedEpisodeBadge: true,
            showOnWatchlistIcon: true,
            showUnwatchedEpisodesCount: true,
          },
        }}
        emptyState={null}
        maxItems={5}
      />
    </div>
  );
};

// Quick action card component
const QuickActionCard: FunctionComponent<{
  icon: string;
  label: string;
  href: string;
  color: 'primary' | 'accent' | 'success' | 'neutral';
}> = ({ icon, label, href, color }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30',
    accent: 'bg-accent-50 text-accent-700 hover:bg-accent-100 dark:bg-accent-900/20 dark:text-accent-300 dark:hover:bg-accent-900/30',
    success: 'bg-success-50 text-success-700 hover:bg-success-100 dark:bg-success-900/20 dark:text-success-300 dark:hover:bg-success-900/30',
    neutral: 'bg-surface-50 text-surface-700 hover:bg-surface-100 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700',
  };

  return (
    <a
      href={href}
      className={clsx(
        'flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft',
        colorClasses[color]
      )}
    >
      <span className="material-icons text-3xl">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
};

export default HomePage;
