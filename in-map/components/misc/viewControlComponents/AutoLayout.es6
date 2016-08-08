import React from 'react';

import {eventBus} from 'in-map/src/services/eventBus';
import SvgIcon from 'in-components/SvgIcon';

import 'in-map/src/components/react/ViewControls/components/AutoLayout.less';


const block = 'in-auto-layout-button';

export default function AutoLayout() {
  return (
    <div className={block}
         onClick={() => eventBus.emit('resetProcessViewLayouting', true)}>
      <SvgIcon type={'autoLayout'}
               width={24}
               height={24}
               color='#7b8e96' />
    </div>
  );
}

const rpt = React.PropTypes;
AutoLayout.propTypes = {
  particlesAreActive: rpt.bool,
  currentView: rpt.string
};
