import React, { FunctionComponent, ReactNode } from 'react';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';

interface EmptyStateProps {
  icon?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'card';
}

export const EmptyState: FunctionComponent<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-6',
      icon: 'text-3xl mb-2',
      title: 'text-base',
      description: 'text-sm mt-1',
    },
    md: {
      container: 'py-10',
      icon: 'text-5xl mb-4',
      title: 'text-xl',
      description: 'text-base mt-2',
    },
    lg: {
      container: 'py-16',
      icon: 'text-6xl mb-6',
      title: 'text-2xl',
      description: 'text-lg mt-3',
    },
  };

  const variantClasses = {
    default: '',
    compact: 'py-4',
    card: 'card p-8',
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center animate-fade-in',
        classes.container,
        variantClasses[variant],
        className
      )}
    >
      {icon && (
        <span
          className={clsx(
            'material-icons text-surface-400 dark:text-surface-500',
            classes.icon
          )}
        >
          {icon}
        </span>
      )}
      <h3
        className={clsx(
          'font-semibold text-surface-900 dark:text-surface-100',
          classes.title
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={clsx(
            'text-surface-500 dark:text-surface-400 max-w-md',
            classes.description
          )}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};

// Pre-configured empty states for common scenarios

export const EmptyWatchlist: FunctionComponent<{ onBrowse?: () => void }> = ({
  onBrowse,
}) => (
  <EmptyState
    icon="bookmark_border"
    title={<Trans>Your watchlist is empty</Trans>}
    description={<Trans>Start adding movies, TV shows, books, and games to keep track of what you want to watch, read, or play.</Trans>}
    action={
      onBrowse && (
        <button onClick={onBrowse} className="btn-primary">
          <span className="material-icons text-sm">explore</span>
          <Trans>Browse Media</Trans>
        </button>
      )
    }
  />
);

export const EmptySearchResults: FunctionComponent<{ query?: string; onClear?: () => void }> = ({
  query,
  onClear,
}) => (
  <EmptyState
    icon="search_off"
    title={<Trans>No results found</Trans>}
    description={
      query ? (
        <Trans>We couldn&apos;t find any matches for &quot;{query}&quot;. Try checking for typos or using different keywords.</Trans>
      ) : (
        <Trans>Try adjusting your search or filters to find what you&apos;re looking for.</Trans>
      )
    }
    action={
      onClear && (
        <button onClick={onClear} className="btn-ghost">
          <span className="material-icons text-sm">clear</span>
          <Trans>Clear Search</Trans>
        </button>
      )
    }
  />
);

export const EmptyItems: FunctionComponent<{ 
  mediaType?: string; 
  onImport?: () => void;
  onSearch?: () => void;
}> = ({
  mediaType,
  onImport,
  onSearch,
}) => {
  const mediaTypeLabel = mediaType ? mediaType.replace('_', ' ') : 'media';
  
  return (
    <EmptyState
      icon="movie_filter"
      title={<Trans>No {mediaTypeLabel} yet</Trans>}
      description={<Trans>Your library is waiting to be built. Import your existing collection or search for new titles to add.</Trans>}
      action={
        onSearch && (
          <button onClick={onSearch} className="btn-primary">
            <span className="material-icons text-sm">search</span>
            <Trans>Search</Trans>
          </button>
        )
      }
      secondaryAction={
        onImport && (
          <button onClick={onImport} className="btn-outline">
            <span className="material-icons text-sm">download</span>
            <Trans>Import</Trans>
          </button>
        )
      }
    />
  );
};

export const EmptyUpcoming: FunctionComponent = () => (
  <EmptyState
    icon="event_busy"
    title={<Trans>No upcoming releases</Trans>}
    description={<Trans>Add items to your watchlist to track upcoming releases and never miss a premiere.</Trans>}
    size="sm"
  />
);

export const EmptyHistory: FunctionComponent = () => (
  <EmptyState
    icon="history"
    title={<Trans>No history yet</Trans>}
    description={<Trans>Start watching, reading, or playing to build your history.</Trans>}
    size="sm"
  />
);

export const ErrorState: FunctionComponent<{
  title?: ReactNode;
  description?: ReactNode;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = <Trans>Something went wrong</Trans>,
  description = <Trans>An error occurred while loading the data. Please try again.</Trans>,
  onRetry,
  className,
}) => (
  <EmptyState
    icon="error_outline"
    title={title}
    description={description}
    action={
      onRetry && (
        <button onClick={onRetry} className="btn-primary">
          <span className="material-icons text-sm">refresh</span>
          <Trans>Try Again</Trans>
        </button>
      )
    }
    className={className}
  />
);

export default EmptyState;
