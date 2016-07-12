import React from 'react';

import * as navigation from 'in-stores/navigation';
import Button from 'in-components/Button';

import 'in-components/sidebars/components/BackToMapButton.less';


const block = 'in-sidebar-back-to-map-button';

export default function BackToMapButton() {
  return (
    <Button className={block + '__button'}
            onClick={navigation.goToMap}>
      Close Dashboard
    </Button>
  );
}
