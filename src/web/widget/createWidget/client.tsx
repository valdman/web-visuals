import React from 'react';
import {hydrate} from 'react-dom';
import {Epic} from 'redux-observable';
import {Action, Reducer} from 'redux';

import {App} from '@/web/App';

import {WidgetDescription} from '..';
import {CreateWidget} from '.';

export const createWidget: CreateWidget = function <Data, Collections, Actions extends Action<unknown>>(
    name: string,
    {controller, view, reducer, epics}: WidgetDescription<Data, Collections, Actions>,
): {
    name: string;
} & WidgetDescription<Data, Collections, Actions> {
    hydrateWidget(name, view, reducer, epics);

    return {
        name,
        controller,
        view,
        reducer,
        epics,
    };
};

export function hydrateWidget<TProps>(
    name: string,
    WidgetView: React.FC<TProps>,
    widgetReducer?: Reducer,
    widgetEpics?: Epic,
): void {
    const hydrateProps = window.__APP_PROPS__[name] as TProps;
    delete window.__APP_PROPS__;
    if (!hydrateProps) {
        throw new Error('Hydration failed');
    }

    const location = document.location.toString();

    hydrate(
        <App
            pageName={name}
            location={location}
            reducer={widgetReducer}
            epics={widgetEpics}
            view={WidgetView}
            hydrateProps={hydrateProps}
        />,
        document.getElementById('root'),
    );
}
