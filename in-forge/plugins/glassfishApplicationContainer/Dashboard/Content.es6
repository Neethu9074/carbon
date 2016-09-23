import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default function GlassfishDashboard({snapshot}) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type='warning'>
        Amx module is not enabled. Please enable the Amx module to support metric collection.
      </DashboardNotification>
    );
  }

  return (
    <div />
  );
}
