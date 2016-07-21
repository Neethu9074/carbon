import React from 'react';

import {getDashboardLink} from 'in-stores/navigation';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-components/sidebars/components/ViewDashboardButton.less';


const block = 'in-sidebar-view-dashboard-button';

export default connectTo(props => {
  return {
    href: getDashboardLink(props.snapshotId)
  };
}, function ViewDashboardButton({href}) {
  return (
    <Button className={block}
            href={href}>
      View Dashboard
    </Button>
  );
});
