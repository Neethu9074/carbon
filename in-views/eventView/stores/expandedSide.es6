import { createExpandedViewStore } from 'in-components/TwoColumnView/store';
import { selectedEventId$ } from 'in-stores/events';

const store = createExpandedViewStore('eventView/expandedSide', 'left');

export const expandedSide$ = store.expandedSide$;
export const toggleLeft = store.toggleLeft;
export const toggleRight = store.toggleRight;

selectedEventId$.subscribe(id => store.set(id ? null : 'left'));
