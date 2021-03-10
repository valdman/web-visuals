import {RequestHandler} from 'express';

import {renderWidget} from '@/web/server/template';
import {PAGES} from '@/web/pages';

type PageName = keyof typeof PAGES;

export function getPage(page: PageName): RequestHandler {
    const renderPage: RequestHandler = async function renderPage(req, res) {
        // Nonce will be in req due to expressCspHeader plugin
        const nonce = ((req as unknown) as {nonce: string})?.nonce || '';
        const {controller, view, reducer, name} = PAGES[page];
        const {jobs = [], data, collections} = await controller(req);
        const state = {data, collections};

        // Jobs could terminate request ahead of render time
        for (const job of jobs) {
            job(res);
        }

        // So ignore render if jobs are terminating
        // # https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client/7086621#7086621
        if (res.headersSent) {
            return;
        }

        try {
            // @todo: widget name discrimination
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const htmlString = renderWidget({
                nonce,
                location: req.url,
                view: <any>view,
                state: <any>state,
                reducer,
                widgetName: name,
            });
            res.send(htmlString);
        } catch (error) {
            console.error(`Widget '${name}' failed to render: `, error);
            res.sendStatus(500).end();
        }
    };
    return renderPage;
}
