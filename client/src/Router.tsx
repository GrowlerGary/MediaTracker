import React, { FunctionComponent } from 'react';
import { Navigate, Routes, Route, Outlet, useLocation } from 'react-router-dom';

import { DetailsPage } from 'src/pages/Details';
import { HomePage } from 'src/pages/Home';
import { LoginPage } from 'src/pages/Login';
import { ItemsPage } from 'src/pages/ItemsPage';
import { useUser } from 'src/api/user';
import { NavComponent } from 'src/components/Nav';
import { UpcomingPage } from 'src/pages/Upcoming';
import { InProgressPage } from 'src/pages/InProgress';
import { SettingsPage } from 'src/pages/Settings';
import { SeasonsPage } from 'src/pages/SeasonsPage';
import { CalendarPage } from 'src/pages/Calendar';
import { RegisterPage } from 'src/pages/Register';
import { useConfiguration } from 'src/api/configuration';
import { NotFound } from 'src/pages/NotFound';
import { SeenHistoryPage } from 'src/pages/SeenHistory';
import { ImportPage } from 'src/pages/Import';
import { TraktTvImportPage } from 'src/pages/import/TraktTv';
import { WatchlistPage } from 'src/pages/WatchlistPage';
import { GoodreadsImportPage } from 'src/pages/import/Goodreads';
import { ListPage } from 'src/pages/ListPage';
import { EpisodePage } from 'src/pages/EpisodePage';
import { ListsPage } from 'src/pages/ListsPage';
import { ErrorState } from 'src/components/EmptyState';
import { Trans } from '@lingui/macro';

// Page transition wrapper
const PageTransition: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div
      key={location.pathname}
      className="animate-fade-in"
    >
      {children}
    </div>
  );
};

export const MyRouter: FunctionComponent = () => {
  const { isLoading, user, error } = useUser();
  const { configuration, isLoading: isLoadingConfiguration } =
    useConfiguration();

  if (isLoading || isLoadingConfiguration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-900 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <span className="text-surface-600 dark:text-surface-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorState
          title={<Trans>Failed to load</Trans>}
          description={error}
        />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<PageLayout><Outlet /></PageLayout>}>
          {user ? (
            <>
              <Route
                path="/login"
                element={<Navigate to="/" replace={true} />}
              />

              {configuration.enableRegistration && (
                <Route
                  path="/register"
                  element={<Navigate to="/" replace={true} />}
                />
              )}

              <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />

              <Route
                path="/settings/*"
                element={<PageTransition><SettingsPage key="settings" /></PageTransition>}
              />
              <Route
                path="/tv"
                element={<PageTransition><ItemsPage key="/tv" mediaType="tv" /></PageTransition>}
              />
              <Route
                path="/movies"
                element={<PageTransition><ItemsPage key="/movies" mediaType="movie" /></PageTransition>}
              />
              <Route
                path="/games"
                element={<PageTransition><ItemsPage key="/games" mediaType="video_game" /></PageTransition>}
              />
              <Route
                path="/books"
                element={<PageTransition><ItemsPage key="/books" mediaType="book" /></PageTransition>}
              />
              <Route
                path="/audiobooks"
                element={<PageTransition><ItemsPage key="/audiobooks" mediaType="audiobook" /></PageTransition>}
              />

              <Route
                path="/upcoming"
                element={<PageTransition><UpcomingPage key="/upcoming" /></PageTransition>}
              />
              <Route
                path="/watchlist"
                element={<PageTransition><WatchlistPage key="/watchlist" /></PageTransition>}
              />

              <Route
                path="/in-progress"
                element={<PageTransition><InProgressPage key="/in-progress" /></PageTransition>}
              />
              <Route
                path="/calendar"
                element={<PageTransition><CalendarPage key="/calendar" /></PageTransition>}
              />
              <Route
                path="/details/:mediaItemId"
                element={<PageTransition><DetailsPage key="/details" /></PageTransition>}
              />
              <Route
                path="/seasons/:mediaItemId/"
                element={<PageTransition><SeasonsPage key="/seasons" /></PageTransition>}
              />
              <Route
                path="/seasons/:mediaItemId/:seasonNumber"
                element={<PageTransition><SeasonsPage key="/seasons" /></PageTransition>}
              />
              <Route
                path="/episode/:mediaItemId/:seasonNumber/:episodeNumber"
                element={<PageTransition><EpisodePage key="/episode" /></PageTransition>}
              />
              <Route
                path="/seen-history/:mediaItemId"
                element={<PageTransition><SeenHistoryPage key="/seen-history" /></PageTransition>}
              />

              <Route path="/lists" element={<PageTransition><ListsPage key="/lists" /></PageTransition>} />

              <Route path="/list/:listId" element={<PageTransition><ListPage key="/list" /></PageTransition>} />

              <Route path="/import" element={<PageTransition><ImportPage key="/import" /></PageTransition>} />
              <Route
                path="/import/trakttv"
                element={<PageTransition><TraktTvImportPage key="/import/trakttv" /></PageTransition>}
              />
              <Route
                path="/import/goodreads"
                element={<PageTransition><GoodreadsImportPage key="/import/goodreads" /></PageTransition>}
              />
            </>
          ) : (
            <>
              {!configuration.noUsers && (
                <Route path="/login" element={<PageTransition><LoginPage key="/login" /></PageTransition>} />
              )}

              {configuration.enableRegistration && (
                <Route
                  path="/register"
                  element={<PageTransition><RegisterPage key="/register" /></PageTransition>}
                />
              )}
            </>
          )}
        </Route>

        <Route
          path="*"
          element={
            user ? (
              <PageLayout><NotFound /></PageLayout>
            ) : (
              <Navigate
                to={configuration.noUsers ? '/register' : '/login'}
                replace={true}
              />
            )
          }
        />
      </Routes>
    </>
  );
};

const PageLayout: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <NavComponent />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </>
  );
};

export default MyRouter;
