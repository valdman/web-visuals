import {Context} from '@/web/widget';

export interface ResolverDescription {
    name: string;
}

export type ResolverResult<Result, Collections> = Promise<{
    status: string;
    result: Result;
    collections?: Collections;
    error?: string;
}>;

export interface Resolver<Params, Result, Collections> {
    (ctx: Context | null, params: Params): ResolverResult<Result, Collections>;
    description: ResolverDescription;
}
