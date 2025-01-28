/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

// @ts-expect-error import QueryProgressIndicator from 'in-components/AnalyzeView/QueryProgressIndicator';
import QueryProgressIndicator from 'in-components/AnalyzeView/QueryProgressIndicator';

export default {
  component: QueryProgressIndicator
};

export function QueryFailed() {
  return (
    <QueryProgressIndicator
      progress={{ loading: false }}
      errors={[{ code: 'TIMEOUT', message: 'TIMEOUT: The query would take too long to run.' }]}
      items={[]}
    />
  );
}
