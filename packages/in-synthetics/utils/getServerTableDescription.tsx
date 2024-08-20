/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';

import { globalSyntheticsPath } from 'in-synthetics/navigation/paths';

/**
 * Returns a description for the server table in the Synthetic Monitoring page.
 * @param context The context for which the description is being generated (websites, mobile apps).
 */
const getServerTableDescription = (context: string) => {
  return (
    <span>
      You can associate synthetic tests to monitor {context} at continuous intervals. Get started in{' '}
      <Link href={globalSyntheticsPath}>Synthetic Monitoring</Link>
    </span>
  );
};

export default getServerTableDescription;
