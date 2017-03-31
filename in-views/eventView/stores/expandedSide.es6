import { createExpandedViewStore } from 'in-components/TwoColumnView/store';

const store = createExpandedViewStore('eventView/expandedSide');

export const expandedSide$ = store.expandedSide$;
export const toggleLeft = store.toggleLeft;
export const toggleRight = store.toggleRight;
