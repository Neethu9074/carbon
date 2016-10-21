import React from 'react';

import PhysicalTableViewContent from 'in-components/tableView/components/PhysicalTableViewContent';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView/FullscreenOverlayView';
import {view$, types} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  view: view$
}, function TableView({view}) {
  if (view !== types.physical) {
    return null;
  }

  return (
    <FullscreenOverlayView>
      <PhysicalTableViewContent />
    </FullscreenOverlayView>
  );
});
