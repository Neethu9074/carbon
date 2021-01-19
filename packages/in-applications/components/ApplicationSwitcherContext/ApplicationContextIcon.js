/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import WithHealthIndication from 'in-components/health/WithHealthIndication';
import SvgIcon from 'in-components/SvgIcon';

export default function ServiceContextIcon({ className, applicationId }) {
  return (
    <WithApplicationHealthIndicationBehaviour
      applicationId={applicationId}
      render={healthInfo => (
        <WithHealthIndication healthInfo={healthInfo} iconSize="l">
          <SvgIcon className={className} type="lib_application" size="l" />
        </WithHealthIndication>
      )}
    />
  );
}
