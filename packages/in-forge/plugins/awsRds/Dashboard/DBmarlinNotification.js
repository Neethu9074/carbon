import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Button from 'in-new-components/Button';

export default function DBmarlinNotification() {
  return (
    <DashboardNotification>
      Looking for even deeper database insights? Check out our integration with{' '}
      <Button
        href="https://www.dbmarlin.com/instana-offer?utm_campaign=Instana&utm_source=Instana&utm_medium=Instana"
        target="_blank"
      >
        DBmarlin
      </Button>
    </DashboardNotification>
  );
}
