import {PAGES} from '@/pages';

type Pages = typeof PAGES;
type PageNames = keyof Pages;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        rootPageName: PageNames;
        // It could be typed via PageNames if all widgets used in page are known in advance
        __APP_PROPS__: {[key: string]: unknown};
        __REDUX_DEVTOOLS_EXTENSION__: () => any;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__(...arg: any): any;
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
