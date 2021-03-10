import React, {ReactElement} from 'react';
import {Helmet} from 'react-helmet';

import {Fonts} from './Fonts';

import {APP_TITLE} from '../index';

export function DefaultHead(): ReactElement {
    return (
        <Helmet defaultTitle={APP_TITLE}>
            <Fonts />
            <meta name='viewport' content='width=device-width, viewport-fit=cover' />
        </Helmet>
    );
}
