import { search } from 'in-stores/snapshot/snapshot';

export const data$ = search({ customQuery: 'entity.selfType:website' });
