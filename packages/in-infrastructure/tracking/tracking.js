/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  track,
  INFRASTRUCTURE_CONTEXT_GUIDE_STACK_LOADED,
  INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_EXPANDED,
  INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_CLICKED
} from 'in-services/tracking/tracking';
import { createDurationTracker } from 'in-services/tracking/mixpanel';

export const contextGuideStackLoadedDurationTracker = createDurationTracker(INFRASTRUCTURE_CONTEXT_GUIDE_STACK_LOADED);
export const trackSidebarRelatedEntitiesExpanded = p => track(INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_EXPANDED, p);
export const trackSidebarRelatedEntitiesClicked = p => track(INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_CLICKED, p);
