import React, { FunctionComponent, useState, useEffect } from 'react';
import clsx from 'clsx';
import { t, Trans } from '@lingui/macro';
import { NavLink, useLocation } from 'react-router-dom';
import { animated, Transition, Spring } from '@react-spring/web';

import { useUser } from 'src/api/user';
import { useDarkMode } from 'src/hooks/darkMode';

export const useRouteNames = () => {
  return [
    { path: '/', name: t`Home`, icon: 'home' },
    { path: '/tv', name: t`TV Shows`, icon: 'tv' },
    { path: '/movies', name: t`Movies`, icon: 'movie' },
    { path: '/games', name: t`Games`, icon: 'sports_esports' },
    { path: '/books', name: t`Books`, icon: 'menu_book' },
    { path: '/audiobooks', name: t`Audiobooks`, icon: 'headphones' },
    { path: '/upcoming', name: t`Upcoming`, icon: 'event_upcoming' },
    { path: '/in-progress', name: t`In Progress`, icon: 'pending_actions' },
    { path: '/watchlist', name: t`Watchlist`, icon: 'bookmark' },
    { path: '/calendar', name: t`Calendar`, icon: 'calendar_today' },
    { path: '/import', name: t`Import`, icon: 'download' },
    { path: '/lists', name: t`Lists`, icon: 'format_list_bulleted' },
  ];
};

export const NavComponent: FunctionComponent = () => {
  const { user, logout } = useUser();
  const { darkMode, setDarkMode } = useDarkMode();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const routes = useRouteNames();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSidebar]);

  const activeRoute = routes.find((r) => r.path === location.pathname);

  return (
    <>
      {user ? (
        <>
          <nav
            className={clsx(
              'sticky top-0 z-40 w-full transition-all duration-200',
              isScrolled
                ? 'glass-strong shadow-soft border-b border-surface-200/50 dark:border-surface-700/50'
                : 'bg-transparent'
            )}
          >
            <div className="flex items-center justify-between h-14 px-4">
              {/* Logo / Brand */}
              <a
                href="#/"
                className="flex items-center gap-2 text-xl font-bold text-surface-900 dark:text-white hover:no-underline"
              >
                <span className="material-icons text-primary-600 dark:text-primary-400">
                  theaters
                </span>
                <span className="hidden sm:inline">MediaTracker</span>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {routes.slice(0, 7).map((route) => (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    className={({ isActive }) =>
                      clsx(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                        'flex items-center gap-1.5',
                        isActive
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100'
                      )
                    }
                    title={route.name}
                  >
                    <span className="material-icons text-base">{route.icon}</span>
                    {route.name}
                  </NavLink>
                ))}
                <div className="relative group">
                  <button className="px-3 py-2 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100 flex items-center gap-1">
                    <span className="material-icons text-base">more_horiz</span>
                    <Trans>More</Trans>
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-white dark:bg-surface-800 rounded-xl shadow-soft-lg border border-surface-200 dark:border-surface-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    {routes.slice(7).map((route) => (
                      <NavLink
                        key={route.path}
                        to={route.path}
                        className={({ isActive }) =>
                          clsx(
                            'px-4 py-2 text-sm flex items-center gap-2 transition-colors',
                            isActive
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                              : 'text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-700'
                          )
                        }
                      >
                        <span className="material-icons text-base">{route.icon}</span>
                        {route.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100 transition-colors"
                  title={darkMode ? t`Switch to light mode` : t`Switch to dark mode`}
                >
                  <span className="material-icons">
                    {darkMode ? 'light_mode' : 'dark_mode'}
                  </span>
                </button>

                {/* User menu (desktop) */}
                <div className="hidden md:flex items-center gap-3 pl-3 border-l border-surface-200 dark:border-surface-700">
                  <a
                    href="#/settings"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 transition-colors"
                  >
                    <span className="material-icons text-base">account_circle</span>
                    {user.name}
                  </a>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-surface-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/20 dark:hover:text-error-400 transition-colors"
                    title={t`Logout`}
                  >
                    <span className="material-icons">logout</span>
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  className="lg:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
                  onClick={() => setShowSidebar(!showSidebar)}
                  aria-label={showSidebar ? t`Close menu` : t`Open menu`}
                >
                  <span className="material-icons">
                    {showSidebar ? 'close' : 'menu'}
                  </span>
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Sidebar */}
          <SideBar
            showSidebar={showSidebar}
            hideSidebar={() => setShowSidebar(false)}
            user={user}
            logout={logout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </>
      ) : (
        <nav className="flex items-center justify-end h-14 px-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100 transition-colors"
          >
            <span className="material-icons">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </nav>
      )}
    </>
  );
};

const SideBar: FunctionComponent<{
  showSidebar: boolean;
  hideSidebar: () => void;
  user: { name: string };
  logout: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}> = (props) => {
  const { showSidebar, hideSidebar, user, logout, darkMode, setDarkMode } = props;
  const routes = useRouteNames();
  const location = useLocation();

  return (
    <Transition
      items={showSidebar}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
      config={{ tension: 300, friction: 30 }}
    >
      {(styles, show) =>
        show && (
          <>
            {/* Backdrop */}
            <animated.div
              style={{ opacity: styles.opacity }}
              className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={hideSidebar}
            />

            {/* Sidebar */}
            <animated.div
              style={{
                transform: styles.opacity.to((o) => `translateX(${(1 - o) * 100}%)`),
              }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 glass-strong shadow-2xl lg:hidden flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-primary-600 dark:text-primary-400">
                    account_circle
                  </span>
                  <span className="font-semibold text-surface-900 dark:text-white">{user.name}</span>
                </div>
                <button
                  onClick={hideSidebar}
                  className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-3 space-y-1">
                  {routes.map((route) => {
                    const isActive = location.pathname === route.path;
                    return (
                      <NavLink
                        key={route.path}
                        to={route.path}
                        onClick={hideSidebar}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                          isActive
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 shadow-sm'
                            : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100'
                        )}
                      >
                        <span
                          className={clsx(
                            'material-icons',
                            isActive ? 'text-primary-600 dark:text-primary-400' : ''
                          )}
                        >
                          {route.icon}
                        </span>
                        {route.name}
                        {isActive && (
                          <span className="ml-auto material-icons text-primary-600 dark:text-primary-400 text-lg">
                            chevron_right
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-surface-200 dark:border-surface-700 space-y-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
                >
                  <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                  {darkMode ? <Trans>Light Mode</Trans> : <Trans>Dark Mode</Trans>}
                </button>
                <a
                  href="#/settings"
                  onClick={hideSidebar}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 transition-colors"
                >
                  <span className="material-icons">settings</span>
                  <Trans>Settings</Trans>
                </a>
                <button
                  onClick={() => {
                    hideSidebar();
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20 transition-colors"
                >
                  <span className="material-icons">logout</span>
                  <Trans>Logout</Trans>
                </button>
              </div>
            </animated.div>
          </>
        )
      }
    </Transition>
  );
};

export default NavComponent;
