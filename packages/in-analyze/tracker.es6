import { createTracker } from 'in-services/tracking/mixpanel';

export const filterAddedTracker = createTracker('analyze.filter.added');
export const filterChangedTracker = createTracker('analyze.filter.changed');
export const filterRemovedTracker = createTracker('analyze.filter.removed');
export const filterClearedTracker = createTracker('analyze.filter.cleared');
