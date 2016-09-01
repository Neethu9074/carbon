import React from 'react';

import {menuContent$} from 'in-components/Controls/stores/menuContentStore';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/components/Menu.less';


const block = 'in-controls-menu';

export default connectTo({
  menuContent: menuContent$
},
function ControlsMenu({menuContent}) {
  if (!menuContent) {
    return null;
  }

  return (
    <div className={block}>
      {menuContent.content}
    </div>
  );
});
