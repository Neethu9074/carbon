import React from 'react';

import {eventBus} from 'in-map/src/services/eventBus';
import {view, types as views} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/components/react/LayoutControls/LayoutControls.less';


const block = 'in-layout-controls';

export default connectTo({
    currentView: view
  }, LayoutControls
);

function LayoutControls({layoutingEnabled, currentView}) {
  if (!currentView || currentView !== views.process) {
    return null;
  }

  return (
    <div className={layoutingEnabled ? block : block + ' ' + block + '__disabled'}
         onClick={() => eventBus.emit('resetProcessViewLayouting', true)}>
      reorder
    </div>
  );
}

const rpt = React.PropTypes;
LayoutControls.propTypes = {
  layoutingEnabled: rpt.bool,
  currentView: rpt.string
};
