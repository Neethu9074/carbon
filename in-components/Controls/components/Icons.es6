import React from 'react';

import Control from 'in-components/Controls/components/Control';
import {SvgIconList} from 'in-components/SvgIcon';

import 'in-components/Controls/components/Icons.less';


export default function Icons() {
  return (
    <Control createMenuContent={createMenuContent}
             tooltipText='DEV ONLY FEATURE. INGORE IT'
             iconSize={24}
             type='dot'
             id='icons' />
  );
}

function createMenuContent() {
  return <SvgIconList className='in-controls-icons' />;
}
