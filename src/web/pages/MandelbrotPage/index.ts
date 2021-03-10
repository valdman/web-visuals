import {createWidget} from '@/web/widget/createWidget';
import controller from './controller';
import {View as view} from './view';

type Transform = string;

export interface Data {
    initTransform: Transform;
}

export interface Collections {
    [key: string]: never;
}

export default createWidget<Data, Collections, undefined>('MandelbrotPage', {
    controller,
    view,
});
