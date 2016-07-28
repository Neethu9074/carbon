import React from 'react';

import PhysicalTableViewContent from 'in-components/tableView/components/PhysicalTableViewContent';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView/FullscreenOverlayView';
import {isTableVisible$} from 'in-components/tableView/stores/visibility';
import {view$, types} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  view: view$
}, function TableView({view}) {
  return (
    <FullscreenOverlayView isOpen$={isTableVisible$}>
      {getContent(view)}
    </FullscreenOverlayView>
  );
});

function getContent(view) {
  if (view === types.physical) {
    return <PhysicalTableViewContent />;
  }
  return null;
}
