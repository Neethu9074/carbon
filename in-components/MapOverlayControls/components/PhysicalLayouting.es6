import React from 'react';

import { setLayoutingStrategy, simpleLayouting$, packedLayouting$ } from 'in-map/stores/physical/layouterStore';
import { currentLayoutingStrategy$ } from 'in-map/stores/physical/layouterStore';
import Control from 'in-components/MapOverlayControls/components/Control';
import { clearAll } from 'in-map/stores/logical/layouterStore';
import connectTo from 'in-hoc/connectTo';

import 'in-components/MapOverlayControls/components/Layouting.less';

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
          onClick={() => {
            setLayoutingStrategy(simpleLayouting$);
            clearAll();
          }}
          tooltipText="Rearrange zones by name"
          type="options"
          isActive={simpleLayouting$ === currentLayoutingStrategy}
        />
        <Control
          className={`${block}__right`}
          onClick={() => {
            setLayoutingStrategy(packedLayouting$);
            clearAll();
          }}
          tooltipText="Rearrange zones as a compact structure"
          type="packed_layouting"
          isActive={packedLayouting$ === currentLayoutingStrategy}
        />
      </div>
    );
  }
);
