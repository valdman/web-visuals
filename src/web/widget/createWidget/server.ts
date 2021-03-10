import {Action} from 'redux';

import {WidgetDescription} from '..';
import {CreateWidget} from '.';

export const createWidget: CreateWidget = function <Data, Collections, Actions extends Action<unknown>>(
    name: string,
    {controller, view, reducer, epics}: WidgetDescription<Data, Collections, Actions>,
): {
    name: string;
} & WidgetDescription<Data, Collections, Actions> {
    return {
        name,
        controller,
        view,
        reducer,
        epics,
    };
};
