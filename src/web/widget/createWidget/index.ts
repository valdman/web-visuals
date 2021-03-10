import {Action} from 'redux';
import {WidgetDescription} from '..';

export interface CreateWidget {
    <Data, Collections, Actions extends Action<unknown> = Action<unknown>>(
        name: string,
        {controller, view, reducer, epics}: WidgetDescription<Data, Collections, Actions>,
    ): {
        name: string;
    } & WidgetDescription<Data, Collections, Actions>;
}

export declare const createWidget: CreateWidget;
