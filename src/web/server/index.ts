import express from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import {expressCspHeader} from 'express-csp-header';
import {HANDLES, ROUTES} from '@/web/pages/route';

import {PORT, SESSION_SECRET} from './config';

import {staticHandler, STATIC_FILE_HANDLE} from './static';
import {resolverHandler} from './resolvers';
import {getPage} from './getPage';
import {CSP} from './csp';
import {assetHandler, ASSET_REDIRECT_HANDLES} from './assets';

const app = express();

app.use(
    cookieSession({
        secret: SESSION_SECRET,
        signed: true,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(expressCspHeader(CSP));

app.get(STATIC_FILE_HANDLE, staticHandler);
app.get(ASSET_REDIRECT_HANDLES, assetHandler);

app.post(HANDLES.resolver, resolverHandler);

app.get(ROUTES.mandelbrot, getPage('MandelbrotPage'));

// Routes below this middleware will be allowed for auth-only
// app.get('*', authRequiredFilter);

app.get('/', (req, res) => {
    res.redirect(ROUTES.mandelbrot);
});

app.get('*', (_, res) => {
    return res.redirect(ROUTES.notFound);
});

app.listen(PORT, () => {
    console.log(`Quest webapp listening at http://0.0.0.0:${PORT}`);
});
