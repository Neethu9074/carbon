import React from 'react';

import {closeDashboard} from 'in-stores/navigation';
import Button from 'in-components/Button';

import 'in-components/sidebars/components/BackToMapButton.less';


const block = 'in-sidebar-back-to-map-button';

export default function BackToMapButton() {
  return (
    <Button className={block}
            onClick={closeDashboard}>
      Close Dashboard
    </Button>
  );
}
