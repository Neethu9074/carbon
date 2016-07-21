import React from 'react';

import {closeDashboardLink$} from 'in-stores/navigation';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-components/sidebars/components/BackToMapButton.less';


const block = 'in-sidebar-back-to-map-button';

export default connectTo({
    href: closeDashboardLink$
}, function BackToMapButton({href}) {
  return (
    <Button className={block}
            href={href}>
      Close Dashboard
    </Button>
  );
});
