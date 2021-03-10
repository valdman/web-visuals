declare module '*.svg' {
    import {FC} from 'react';

    const SvgComponent: FC<{[key: string]: never}>;
    export = SvgComponent;
}
