import React from 'react';

import DBmarlinNotification from 'in-integrations/database/dbmarlin/DBmarlinNotification';

export default function DBmarlinNotificationMessage() {
  return (
    <DBmarlinNotification>
      <span style={{ marginRight: '5rem' }}>Looking for even deeper database insights?</span>
      <a href="https://www.dbmarlin.com/instana-offer?utm_campaign=Instana&utm_source=Instana&utm_medium=Instana">
        Check out our integration with DBmarlin!
      </a>
    </DBmarlinNotification>
  );
}
