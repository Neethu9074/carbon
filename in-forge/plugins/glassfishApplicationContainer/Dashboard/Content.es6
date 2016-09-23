import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';

export default function GlassfishDashboard({snapshot}) {
  const version = snapshot.getIn(['data', 'version']);
  if (!version) {
    return (
      <DashboardNotification type='warning'>
        Amx module is not enabled glassfish. Please enable it to be able to collect data.
      </DashboardNotification>
    );
  }
  return (
    <div>
    </div>
  );
}
