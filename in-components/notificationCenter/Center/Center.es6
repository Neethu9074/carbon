import React from 'react';

import {isOpen$} from 'in-components/notificationCenter/Center/stores/notificationCenterVisibilityStore';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView/FullscreenOverlayView';
import EventList from 'in-components/notificationCenter/Center/components/EventList';


export default function Center() {
  return (
    <FullscreenOverlayView isOpen$={isOpen$}>
      <EventList />
    </FullscreenOverlayView>
  );
}
