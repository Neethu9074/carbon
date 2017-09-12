import { search } from 'in-stores/snapshot/snapshot';

export const data$ = search({ queryExtension: 'entity.selfType:website' });
