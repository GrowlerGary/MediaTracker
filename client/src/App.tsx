import React, { FunctionComponent, useEffect, useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter as Router } from 'react-router-dom';
import { FetchError } from 'src/api/api';
import { DarkModeProvider } from 'src/hooks/darkMode';

import { MyRouter } from './Router';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Trans } from '@lingui/macro';
import { setupI18n } from 'src/i18n/i18n';
import { useFonts } from 'src/hooks/fonts';

import './styles/materialIcons.css';
import './styles/fonts/robotoCondensed.css';
import './styles/fullcalendar.css';
import './styles/main.scss';
import './styles/tailwind.css';

setupI18n();

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      mutationFn: (a) => {
        console.log(a);
        return null;
      },
    },
    queries: {
      queryFn: (x) => {
        console.log(x);
        return null;
      },
      keepPreviousData: true,
      onSuccess: (data) => {
        if (
          data &&
          typeof data === 'object' &&
          data['MediaTrackerError'] === true &&
          typeof data['errorMessage'] === 'string'
        ) {
          throw new Error(data['errorMessage']);
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof FetchError) {
        console.log(error.status);
        globalSetErrorMessage(error.message);
      }
    },
    onSuccess: () => {
      globalSetErrorMessage(null);
    },
  }),
});

let globalSetErrorMessage: (message: string | null) => void;

// Loading screen component
const LoadingScreen: FunctionComponent = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-900 rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
      </div>
      <span className="text-surface-600 dark:text-surface-400 font-medium">
        <Trans>Loading...</Trans>
      </span>
    </div>
  </div>
);

// Error Toast component
const ErrorToast: FunctionComponent<{
  message: string;
  onDismiss: () => void;
}> = ({ message, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`
        fixed z-50 top-4 left-1/2 -translate-x-1/2 
        flex items-center gap-3 px-4 py-3 rounded-xl
        bg-error-600 text-white shadow-lg shadow-error-500/30
        transition-all duration-300
        ${isExiting ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}
      `}
    >
      <span className="material-icons">error_outline</span>
      <span className="font-medium">
        <Trans>Server error: {message}</Trans>
      </span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onDismiss, 300);
        }}
        className="p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <span className="material-icons text-sm">close</span>
      </button>
    </div>
  );
};

export const App: FunctionComponent = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { loaded } = useFonts();

  useEffect(() => {
    globalSetErrorMessage = setErrorMessage;
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      globalSetErrorMessage = () => {};
    };
  }, []);

  // NOTE: Font loading check disabled - was causing blank page
  // if (!loaded) {
  //   return <LoadingScreen />;
  // }

  return (
    <I18nProvider i18n={i18n}>
      <DarkModeProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors">
              <MyRouter />
            </div>
          </Router>

          {errorMessage && (
            <ErrorToast
              message={errorMessage}
              onDismiss={() => setErrorMessage(null)}
            />
          )}
        </QueryClientProvider>
      </DarkModeProvider>
    </I18nProvider>
  );
};

export default App;
