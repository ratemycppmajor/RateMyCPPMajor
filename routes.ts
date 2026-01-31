/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  '/',
  '/new-verification',
  '/videos/sample.mp4',
  '/majors',
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  '/login',
  '/sign-up',
  '/error',
  '/reset',
  '/new-password',
  '/add',
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication puposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';


/**
 * The prefix for API public routes
 * Routes that start with this prefix are used for API public puposes
 * @type {string}
 */
export const apiPublicPrefix = '/api/majors';

/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
