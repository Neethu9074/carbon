import React from 'react';

import { closeDashboardLink$ } from 'in-stores/navigation';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './DashboardCloseButton.less';

const block = 'in-dashboard-close-button';

export default connectTo(
  {
    href: closeDashboardLink$
  },
  function DashboardCloseButton({ href }) {
    return (
      <Button href={href} className={block}>
        close
      </Button>
    );
  }
);
