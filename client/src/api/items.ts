import { useQuery } from 'react-query';

import { Items } from 'mediatracker-api';
import { mediaTrackerApi } from 'src/api/api';

export const useItems = (args: Items.Paginated.RequestQuery) => {
  const { error, data, isFetched, refetch } = useQuery(
    ['items', args],
    async () => mediaTrackerApi.items.paginated(args),
    {
      keepPreviousData: true,
    }
  );

  return {
    items: data?.data,
    error: error,
    isLoading: !isFetched,
    numberOfPages: data ? data.totalPages : undefined,
    numberOfItemsTotal: data ? data.total : undefined,
    refetch: refetch,
  };
};
