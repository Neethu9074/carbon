/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

export default function CveVulnerabilitiesTabBanner() {
  // @ts-expect-error TS2304: Cannot find name solis
  // component is loaded from a script in ui-client/packages/in-client/index.html
  return <solis-teaser product="concert" type="banner" variation="vulnerabilities" />;
}
