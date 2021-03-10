import React, {createContext, ReactElement, useContext, useEffect, useState} from 'react';
import qs, {ParsedQs} from 'qs';
import {History, Location} from 'history';

interface ContextProps {
    readonly history: History;
    readonly location: Location;
}

interface Props {
    history: History;
    children: ReactElement;
}

export const HistoryContext = createContext<ContextProps>({
    history: undefined,
    location: undefined,
});

export function HistoryProvider({history, children}: Props): ReactElement {
    const [location, setLocation] = useState(history?.location);

    useEffect(() => {
        const unlisten = history.listen(function ({action, location}) {
            console.log('history changing action ', action);
            setLocation(location);
        });
        return unlisten;
    }, [history]);

    return <HistoryContext.Provider value={{history, location}}>{children}</HistoryContext.Provider>;
}

export function useLocation(): Location {
    const {location} = useContext(HistoryContext);
    return location;
}

export function useHistory(): History {
    const {history} = useContext(HistoryContext);
    return history;
}

export function useQuery(): ParsedQs {
    const location = useLocation();
    const queryString = location?.search || '';
    return qs.parse(queryString.replace('?', ''));
}
