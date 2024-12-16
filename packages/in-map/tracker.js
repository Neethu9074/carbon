/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { MAP_SELECT_ENTITY } from 'in-services/tracking/tracking';
import { UI_INTERACTION } from 'in-services/util/constants';

export const entitySelectedTracker = customData => {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  const { path, ...customPayload } = customData;
  const data = {
    path,
    parentPageCategory: productArea,
    parentPageName: pageRootName,
    payload: customPayload,
    action: MAP_SELECT_ENTITY
  };

  eventTracker({ data, segmentEventName: UI_INTERACTION });
};
