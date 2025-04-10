/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createStore } from 'in-stores/store';

const mapSidebarFocusStore = createStore({
  name: 'in-map/MapSidebar/stores/focus',
  initialValue: false
});

export const isMapSidebarFocused$ = mapSidebarFocusStore.observable.distinct().nextFrame();

export function setMapSidebarFocused(focused: boolean) {
  mapSidebarFocusStore.applyStateMutation(() => focused);
}
