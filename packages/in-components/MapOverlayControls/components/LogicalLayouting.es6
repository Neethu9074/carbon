import React from 'react';

import {
  setLayoutingStrategy,
  fruchtermannReingoldLayouting$,
  vizceralLayouting$
} from 'in-map/stores/logical/layouterStore';
import { currentLayoutingStrategy$ } from 'in-map/stores/logical/layouterStore';
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
            setLayoutingStrategy(vizceralLayouting$);
            clearAll();
          }}
          tooltipText="Rearrange services as a flow"
          type="flow"
          isActive={vizceralLayouting$ === currentLayoutingStrategy}
        />
        <Control
          className={`${block}__right`}
          onClick={() => {
            setLayoutingStrategy(fruchtermannReingoldLayouting$);
            clearAll();
          }}
          tooltipText="Rearrange services"
          type="graph"
          isActive={fruchtermannReingoldLayouting$ === currentLayoutingStrategy}
        />
      </div>
    );
  }
);
