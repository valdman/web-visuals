import {RequestHandler} from 'express';
import fs from 'fs';
import path from 'path';

const ASSETS_PATHS = {
    '/favicon.ico': path.resolve(__dirname, 'assets', 'favicon.ico'),
};

export const ASSET_REDIRECT_HANDLES = Object.keys(ASSETS_PATHS);

export const assetHandler: RequestHandler = function assetHandler(req, res) {
    const userPath = <keyof typeof ASSETS_PATHS>req.originalUrl;
    const filename = ASSETS_PATHS[userPath];

    fs.readFile(filename, function (err, data) {
        if (err) {
            res.sendStatus(404);
        } else {
            // Set the content type based on the file
            res.contentType(filename);
            res.send(data);
        }
        res.end();
    });
};
