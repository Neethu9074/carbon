import React from 'react';

import {eventBus} from 'in-map/src/services/eventBus';
import {view, types as views} from 'in-stores/view';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/components/react/ViewControls/components/AutoLayout.less';


const block = 'in-auto-layout-button';

export default connectTo({
    currentView: view
  }, AutoLayout
);

function AutoLayout({currentView}) {
  if (!currentView || currentView !== views.process) {
    return null;
  }

  return (
    <Tooltip content='Apply automatic layouting'>
      <div className={block}
           onClick={() => eventBus.emit('resetProcessViewLayouting', true)}>
        <SvgIcon type={'autoLayout'}
                 width={24}
                 height={24}
                 color='#7b8e96' />
      </div>
    </Tooltip>
  );
}

const rpt = React.PropTypes;
AutoLayout.propTypes = {
  particlesAreActive: rpt.bool,
  currentView: rpt.string
};
