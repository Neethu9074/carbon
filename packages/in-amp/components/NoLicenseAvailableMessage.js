import React from 'react';

import Message from 'in-new-components/Message';

export default function NoLicenseAvailableMessage() {
  return <Message withIcon title="There has been no active paid license in the past 30 days." />;
}
