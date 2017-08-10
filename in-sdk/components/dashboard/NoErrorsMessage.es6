import React from 'react';

import './NoErrorsMessage.less';

const block = 'in-dashboard-no-errors';

export default function NoErrorsMessage() {
  return (
    <p className={block}>
      No errors in the given time window. Good job!
    </p>
  );
}
