import React from 'react';

import Control from 'in-components/MapOverlayControls/components/Control';
import { SvgIconList } from 'in-components/SvgIcon';

import 'in-components/MapOverlayControls/components/Icons.less';

export default function Icons() {
  return (
    <Control createMenuContent={createMenuContent} tooltipText="Icon list. DEV ONLY FEATURE." type="dot" id="icons" />
  );
}

function createMenuContent() {
  return <SvgIconList className="in-controls-icons" />;
}
