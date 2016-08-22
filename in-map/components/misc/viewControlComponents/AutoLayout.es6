import React from 'react';

import {clearAll} from 'in-map/stores/logical/layouterStore';
import SvgIcon from 'in-components/SvgIcon';

import 'in-map/components/misc/viewControlComponents/AutoLayout.less';


const block = 'in-auto-layout-button';

export default function AutoLayout() {
  return (
    <div className={block}
         onClick={clearAll}>
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
