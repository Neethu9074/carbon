import React from 'react';

import { menuContent$ } from 'in-components/MapOverlayControls/stores/menuContentStore';
import connectTo from 'in-hoc/connectTo';

import 'in-components/MapOverlayControls/components/Menu.less';

const block = 'in-controls-menu';

export default connectTo(
  {
    menuContent: menuContent$
  },
  function ControlsMenu({ menuContent }) {
    if (!menuContent) {
      return null;
    }

    return (
      <div className={block}>
        {menuContent.content}
      </div>
    );
  }
);
