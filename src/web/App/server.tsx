import React, {ReactElement} from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import identity from 'lodash.identity';
import {createMemoryHistory, History} from 'history';

import {HistoryProvider} from '@/web/utils/history';

import {DefaultHead} from './components/DefaultHead';
import {Props, App as AppComponent} from '.';

export function getInMemoryHistory(location: string): History {
    return createMemoryHistory({
        initialEntries: [location],
    });
}

export const App: typeof AppComponent = function ({
    view: View,
    location,
    reducer,
    hydrateProps,
}: Props<unknown>): ReactElement {
    const store = createStore(reducer || identity, hydrateProps);
    const history = getInMemoryHistory(location);

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
