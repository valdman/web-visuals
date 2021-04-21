import {createWidget} from '@/web/widget/createWidget';
import controller from './controller';
import {View as view} from './View';

export interface Data {
    [key: string]: never;
}

export interface Collections {
    [key: string]: never;
}

export default createWidget<Data, Collections, undefined>('CellularPage', {
    controller,
    view,
});
