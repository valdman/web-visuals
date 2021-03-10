import {Context, ControllerResult} from '@/web/widget';
import {Data, Collections} from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function controller(ctx: Context): ControllerResult<Data, Collections> {
    return {
        data: {initTransform: 'salam amrchal'},
        collections: {},
    };
}
