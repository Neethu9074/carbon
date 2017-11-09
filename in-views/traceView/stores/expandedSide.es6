import { createExpandedViewStore } from 'in-components/TwoColumnView/store';
import { selectedTraceId$ } from 'in-stores/traces';

const store = createExpandedViewStore('traceView/expandedSide', 'left');

export const expandedSide$ = store.expandedSide$;
export const toggleLeft = store.toggleLeft;
export const toggleRight = store.toggleRight;

selectedTraceId$.subscribe(id => store.set(id ? null : 'left'));
