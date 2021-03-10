import {RequestHandler} from 'express';
import fs from 'fs';
import path from 'path';

export const STATIC_FILE_HANDLE = '/static/:file(*)';

export const staticHandler: RequestHandler = function serveStatic(req, res) {
    const webappPath = path.resolve(__dirname, 'webapp');
    const userPath = req.params.file;
    if (userPath.indexOf('\0') !== -1) {
        return res.send('That was evil.');
    }

    const filename = path.resolve(webappPath, userPath);

    if (filename.indexOf(filename) !== 0) {
        res.statusCode = 420; // Enhance your calm
        return res.send('trying to sneak out of the web root?');
    }

    fs.readFile(filename, function (err, data) {
        if (err) {
            res.sendStatus(404);
        } else {
            // Set the content type based on the file
            res.contentType(req.params.file);
            res.send(data);
        }
        res.end();
    });
};
