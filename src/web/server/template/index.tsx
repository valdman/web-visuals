import React from 'react';
import {renderToString} from 'react-dom/server';

import {WidgetState} from '@/web/widget';
import {App} from '@/web/App';
import {Reducer} from 'redux';

type ServerRenderProps<Data, Collections> = {
    widgetName: string;
    location: string;
    nonce: string;
    view(props: Data): React.ReactElement;
    reducer: Reducer;
    state: WidgetState<Data, Collections>;
};

export function renderWidget<Data, Collections>({
    widgetName,
    location,
    view,
    state,
    reducer,
    nonce,
}: ServerRenderProps<Data, Collections>): string {
    const appRendered = renderToString(
        <App pageName={widgetName} location={location} view={view} reducer={reducer} hydrateProps={state} />,
    );
    // const helmet = Helmet.renderStatic();
    const page = htmlTemplate({
        body: appRendered,
        nonce,
        state,
        rootPageName: widgetName,
        // helmet,
    });
    return page;
}

type TemplateProps<T> = {
    body: string;
    nonce: string;
    state: T;
    rootPageName: string;
    // helmet: HelmetData;
};

function htmlTemplate<T>({body, nonce, state, rootPageName = 'index'}: TemplateProps<T>) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/static/${rootPageName}.css">
        </head>
        <body>
          <div id="root">${body}</div>
        </body>
        <script nonce='${nonce}'>
          window.rootPageName = ${JSON.stringify(rootPageName)};
          window.__APP_PROPS__ = {};
          window.__APP_PROPS__.${rootPageName} = ${JSON.stringify(state).replace(/</g, '\\u003c')};
        </script>
        <script async nonce='${nonce}' src='/static/${rootPageName}.js'></script>
      </html>
    `;
}
