import React, {
  FormEventHandler,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';
import { Link, useSearchParams } from 'react-router-dom';
import { Plural, Trans } from '@lingui/macro';

import { useSearch } from 'src/api/search';
import { Items } from 'mediatracker-api';
import { useItems } from 'src/api/items';
import { GridItemAppearanceArgs, GridItem } from 'src/components/GridItem';
import { useOrderByComponent } from 'src/components/OrderBy';
import { useFilterBy } from 'src/components/FilterBy';
import { Skeleton, GridItemsSkeleton } from 'src/components/Skeleton';
import { EmptySearchResults, EmptyItems, ErrorState } from 'src/components/EmptyState';

// Search component with improved styling
const Search: FunctionComponent<{
  onSearch: (value: string) => void;
  initialValue?: string;
}> = (props) => {
  const { onSearch, initialValue = '' } = props;
  const [textInputValue, setTextInputValue] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSearch(textInputValue);
  };

  const handleClear = () => {
    setTextInputValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={onFormSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={clsx(
          'relative flex items-center bg-white dark:bg-surface-900 rounded-xl border-2 transition-all duration-200',
          isFocused
            ? 'border-primary-500 shadow-lg shadow-primary-500/20'
            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
        )}
      >
        <span className="pl-4 text-surface-400 material-icons">search</span>
        <input
          ref={inputRef}
          type="text"
          value={textInputValue}
          onChange={(e) => setTextInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t`Search for movies, shows, games, books...`}
          className="flex-1 px-3 py-3.5 bg-transparent border-none outline-none text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500"
        />
        {textInputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 mr-1 rounded-full text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <span className="material-icons text-lg">close</span>
          </button>
        )}
        <button
          type="submit"
          className="m-1.5 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Trans>Search</Trans>
        </button>
      </div>
    </form>
  );
};

// Modern pagination component
export const Pagination: FunctionComponent<{
  numberOfPages: number;
  page: number;
  setPage: (value: number) => void;
}> = (props) => {
  const { numberOfPages, page, setPage } = props;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = numberOfPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= numberOfPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(numberOfPages);
      } else if (page >= numberOfPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = numberOfPages - 3; i <= numberOfPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(numberOfPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 my-6">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={t`Previous page`}
      >
        <span className="material-icons">chevron_left</span>
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-surface-400 dark:text-surface-500"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum as number)}
              className={clsx(
                'min-w-[40px] px-3 py-2 rounded-lg font-medium text-sm transition-all duration-150',
                pageNum === page
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                  : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
              )}
            >
              {pageNum}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === numberOfPages}
        className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={t`Next page`}
      >
        <span className="material-icons">chevron_right</span>
      </button>
    </div>
  );
};

export const PaginatedGridItems: FunctionComponent<{
  args: Omit<Items.Paginated.RequestQuery, 'page' | 'filter'>;
  showSortOrderControls?: boolean;
  showSearch?: boolean;
  gridItemAppearance?: GridItemAppearanceArgs;
  mediaType?: string;
}> = (props) => {
  const { args, showSortOrderControls, showSearch, gridItemAppearance, mediaType } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>();

  const [page, _setPage] = useState(Number(searchParams?.get('page')) || 1);

  const { orderBy, sortOrder, OrderByComponent } = useOrderByComponent({
    sortOrder: args.sortOrder,
    orderBy: args.orderBy,
    mediaType: args.mediaType,
  });
  const { filter, FilterByComponent } = useFilterBy(args.mediaType);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy, sortOrder, JSON.stringify(filter)]);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  const setPage = useCallback(
    (value: number) => {
      _setPage(value);
      window.document.body.scrollIntoView({ behavior: 'smooth' });

      if (value === 1) {
        setSearchParams(
          Object.fromEntries(
            Array.from(searchParams.entries()).filter(
              ([name]) => name !== 'page'
            )
          )
        );
      } else {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          page: value.toString(),
        });
      }
    },
    [searchParams, setSearchParams]
  );

  const {
    isLoading: isLoadingItems,
    items,
    numberOfPages,
    numberOfItemsTotal,
    error: itemsError,
    refetch,
  } = useItems({
    ...args,
    ...filter,
    page: page,
    orderBy: orderBy,
    sortOrder: sortOrder,
  });

  const {
    items: searchResult,
    isLoading: isLoadingSearchResult,
    search,
    error: searchError,
  } = useSearch();

  useEffect(() => {
    if (searchQuery?.trim().length === 0) {
      setSearchQuery(undefined);
      setSearchParams(
        Object.fromEntries(
          Array.from(searchParams.entries()).filter(
            ([name]) => name !== 'search'
          )
        )
      );
    } else if (searchQuery) {
      setSearchParams({
        search: searchQuery,
      });
      search({ mediaType: args.mediaType, query: searchQuery });
      _setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.mediaType, searchQuery]);

  const isLoading = isLoadingSearchResult || isLoadingItems;
  const error = itemsError || searchError;
  const hasNoItems = !isLoading && !searchQuery && items.length === 0 && Object.keys(filter).length === 0;

  if (error && !isLoading) {
    return (
      <ErrorState
        onRetry={refetch}
        className="py-16"
      />
    );
  }

  return (
    <>
      <div className="flex justify-center w-full" ref={mainContainerRef}>
        <div className="flex flex-row flex-wrap items-grid w-full">
          <div className="mb-1 header">
            {showSearch && args.mediaType && (
              <Search
                onSearch={setSearchQuery}
                initialValue={searchParams.get('search') || ''}
              />
            )}

            {showSearch && hasNoItems && (
              <EmptyItems
                mediaType={mediaType}
                onSearch={() => document.querySelector('input[type="text"]')?.focus()}
                onImport={() => window.location.href = '#/import'}
              />
            )}

            {!isLoading && !hasNoItems && (
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {searchQuery ? (
                    <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                      <span className="material-icons text-surface-400">search</span>
                      <span>
                        <Plural
                          value={searchResult?.length || 0}
                          one="Found 1 result"
                          other={`Found ${searchResult?.length || 0} results`}
                        />
                        {` for "${searchQuery}"`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                      <span className="material-icons text-surface-400">folder_open</span>
                      <span>
                        <Plural
                          value={numberOfItemsTotal}
                          one="1 item"
                          other={`${numberOfItemsTotal} items`}
                        />
                      </span>
                    </div>
                  )}
                </div>

                {showSortOrderControls && !searchQuery && (
                  <div className="flex items-center gap-2">
                    <FilterByComponent />
                    <OrderByComponent />
                  </div>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="w-full flex flex-wrap justify-center gap-5 py-8">
              <GridItemsSkeleton count={10} />
            </div>
          ) : (
            <>
              {searchQuery && (searchResult?.length === 0 || !searchResult) ? (
                <div className="w-full">
                  <EmptySearchResults
                    query={searchQuery}
                    onClear={() => setSearchQuery('')}
                  />
                </div>
              ) : (
                <>
                  {(searchQuery ? searchResult : items)?.map((mediaItem, index) => (
                    <div
                      key={mediaItem.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <GridItem
                        mediaType={args.mediaType}
                        mediaItem={mediaItem}
                        appearance={{
                          ...gridItemAppearance,
                          showAddToWatchlistAndMarkAsSeenButtons:
                            Boolean(searchQuery),
                        }}
                      />
                    </div>
                  ))}

                  <div className="footer w-full">
                    {!searchQuery && items && !isLoadingItems && numberOfPages > 1 && (
                      <Pagination
                        numberOfPages={numberOfPages}
                        page={page}
                        setPage={setPage}
                      />
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PaginatedGridItems;
