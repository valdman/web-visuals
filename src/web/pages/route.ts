import qs from 'qs';

// Routes are page urls that show content to user
export const ROUTES = {
    notFound: '/404',
    mandelbrot: '/mandelbrot',
    forgetPassword: '/login?mode=forget-password',
};

// Handles are used for XHR
export const HANDLES = {
    resolver: '/resolver',
};

export function getRouteWithParams(url: string, params?: Record<string, string | number>): string {
    const [base, queryStringEbeded = ''] = url.split('?');
    const queryEmbeded = qs.parse(queryStringEbeded);
    const query = {
        ...queryEmbeded,
        ...(params || {}),
    };
    return `${base}?${qs.stringify(query)}`;
}
