/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard() {
  const href = '/';
  return <RedirectWithHash href={href} />;
}
