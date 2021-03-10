import React, {ReactElement, useEffect} from 'react';
import {applyMiddleware, compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import identity from 'lodash/identity';
import {createBrowserHistory} from 'history';

import {HistoryProvider} from '@/web/utils/history';

import {DefaultHead} from './components/DefaultHead';
import {Props, App as AppComponent} from '.';

const history = createBrowserHistory();

export const App: typeof AppComponent = function ({
    view: View,
    reducer,
    hydrateProps,
    epics,
}: Props<unknown>): ReactElement {
    const epicMiddleware = createEpicMiddleware({
        dependencies: {
            history,
        },
    });
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(reducer || identity, hydrateProps, composeEnhancers(applyMiddleware(epicMiddleware)));

    useEffect(() => {
        if (epics) {
            epicMiddleware.run(epics);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DefaultHead />
            <Provider store={store}>
                <HistoryProvider history={history}>
                    <View {...hydrateProps} />
                </HistoryProvider>
            </Provider>
        </>
    );
};
