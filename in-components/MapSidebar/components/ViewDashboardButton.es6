import React from 'react';

import { getDashboardLink } from 'in-stores/navigation';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ViewDashboardButton.less';

const block = 'in-sidebar-view-dashboard';

export default connectTo(
  props => {
    return {
      href: getDashboardLink(props.snapshotId)
    };
  },
  function ViewDashboardButton({ href }) {
    return (
      <Button href={href} className={block}>
        Open Dashboard
      </Button>
    );
  }
);
