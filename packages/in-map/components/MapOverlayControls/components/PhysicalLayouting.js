import React from 'react';

import { setLayoutingStrategy, simpleLayouting$, packedLayouting$ } from 'in-map/stores/physical/layouterStore';
import { currentLayoutingStrategy$ } from 'in-map/stores/physical/layouterStore';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/MapOverlayControls/components/Layouting.less';

const block = 'in-controls-layouting';

export default connectTo(
  {
    currentLayoutingStrategy: currentLayoutingStrategy$
  },
  function PhysicalLayouting({ currentLayoutingStrategy }) {
    return (
      <div className={block}>
        <Control
          className={`${block}__left`}
          onClick={() => setLayoutingStrategy(simpleLayouting$)}
          tooltipText="Rearrange zones by name"
          type="lib_menu_more_horizontal"
          isActive={simpleLayouting$ === currentLayoutingStrategy}
        />
        <Control
          className={`${block}__right`}
          onClick={() => setLayoutingStrategy(packedLayouting$)}
          tooltipText="Rearrange zones as a compact structure"
          type="lib_views_apps"
          isActive={packedLayouting$ === currentLayoutingStrategy}
        />
      </div>
    );
  }
);
