import React, {FC} from 'react';
import {Reducer} from 'redux';
import {Epic} from 'redux-observable';

export interface Props<ViewProps> {
    pageName: string;
    reducer: Reducer;
    // Mandatory on server
    location: string;
    hydrateProps: ViewProps;
    view: React.FunctionComponent<ViewProps>;
    epics?: Epic;
}

export const APP_TITLE = 'Web Visuals';

export declare const App: FC<Props<unknown>>;
