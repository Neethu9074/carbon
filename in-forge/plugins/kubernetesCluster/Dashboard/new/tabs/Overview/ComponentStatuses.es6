import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';

export default function ComponentStatuses() {
  // data will look like this
  // "componentStatuses": {
  //   "scheduler": {
  //     "Healthy": "True",
  //     "message": "ok"
  //   },
  //   "controller-manager": {
  //     "Healthy": "True",
  //     "message": "ok"
  //   },
  //   "etcd-1": {
  //     "Healthy": "True",
  //     "message": "{\"health\": \"true\"}"
  //   },
  //   "etcd-0": {
  //     "Healthy": "True",
  //     "message": "{\"health\": \"true\"}"
  //   }
  // }
  return (
    <DashboardTile title="Component Statuses">
      TODO
    </DashboardTile>
  );
}
