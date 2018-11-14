import { createTracker } from 'in-services/tracking/mixpanel';

export const clickCallTracker = createTracker('analyze.call.click');
export const clickGroupTracker = createTracker('analyze.group.click');
export const clickTraceTracker = createTracker('analyze.trace.click');
