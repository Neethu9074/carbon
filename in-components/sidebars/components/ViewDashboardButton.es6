import React from 'react';

import {setSelectedSnapshotId} from 'in-stores/snapshot';
import * as navigation from 'in-stores/navigation';
import Button from 'in-components/Button';

import 'in-components/sidebars/components/ViewDashboardButton.less';


const block = 'in-sidebar-view-dashboard-button';

export default function ViewDashboardButton({snapshot}) {
  return (
    <Button className={block + '__button'}
            onClick={() => {
              setSelectedSnapshotId(snapshot.get('id'));
              navigation.goToDashboard();
            }}>
      view dashboard
    </Button>
  );
}
