import {RequestHandler} from 'express';
import {Resolver} from '@/web/resolvers';

const REMOTE_RESOLVERS: Resolver<unknown, unknown, unknown>[] = [];

export const resolverHandler: RequestHandler = async function resolverHandler(req, res) {
    const name = (req?.query?.name || '').toString();

    const resolverFunction = REMOTE_RESOLVERS.find((resolver) => resolver.description.name === name);

    if (!resolverFunction) {
        return res.send({
            status: '404',
            error: `Resolver '${name}' couldn't be loaded from client. Check "REMOTE_RESOLVERS"`,
        });
    }

    try {
        const result = await resolverFunction(req, req.body);
        return res.send(result);
    } catch (error) {
        return res.send({
            status: '500',
            error,
        });
    }
};
