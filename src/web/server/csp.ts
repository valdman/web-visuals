import {INLINE, NONCE, NONE, SELF, STRICT_DYNAMIC} from 'express-csp-header';

/* Using sha256 hashes of some scripts, loaded by GTM */
const GOOGLE_FONTS_SOURCES = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
const YOUTUBE_SOURCES = ['youtube.com', 'www.youtube.com'];

export const CSP = {
    directives: {
        'object-src': [NONE],
        'default-src': [SELF],
        'script-src': [NONCE, INLINE, STRICT_DYNAMIC, 'http:', 'https:'],
        'style-src': [SELF, INLINE, ...GOOGLE_FONTS_SOURCES],
        'img-src': [SELF, 'data:', 'https:'],
        'media-src': ['https:'],
        'connect-src': [SELF],
        'font-src': [...GOOGLE_FONTS_SOURCES],
        'frame-src': [...YOUTUBE_SOURCES],
    },
};
