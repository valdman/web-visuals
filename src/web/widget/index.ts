import React from 'react';
import {Action, Reducer} from 'redux';
import {Epic} from 'redux-observable';
import {Request, Response} from 'express';

export * from './createWidget';

export type WidgetState<Data, Collections> = {
    data: Data;
    collections: Collections;
};

export interface Job {
    (res: Response): void;
}

export type Context = Request;

export type ControllerResult<Data, Collections> = Promise<WidgetState<Data, Collections> & {jobs?: Job[]}>;
export type Controller<Data, Collections> = (ctx: Context) => ControllerResult<Data, Collections>;
export type WidgetView<Data> = React.FC<Data>;
export interface WidgetDescription<Data, Collections, Actions extends Action<unknown>> {
    controller: Controller<Data, Collections>;
    view: WidgetView<Data>;
    reducer?: Reducer<WidgetState<Data, Collections>, Actions>;
    epics?: Epic;
}
