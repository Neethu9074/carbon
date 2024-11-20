/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { EntityHealthInfo } from '@instana/types';
import { SvgIcon } from '@instana/components';

// @ts-expect-error import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
// @ts-expect-error import WithHealthIndication from 'in-components/health/WithHealthIndication';
import WithHealthIndication from 'in-components/health/WithHealthIndication';

export default function ServiceContextIcon({ className, applicationId }: { className: string; applicationId: string }) {
  return (
    <WithApplicationHealthIndicationBehaviour
      applicationId={applicationId}
      render={(healthInfo: EntityHealthInfo) => (
        <WithHealthIndication healthInfo={healthInfo} iconSize="l">
          <SvgIcon className={className} type="lib_application" size="l" />
        </WithHealthIndication>
      )}
    />
  );
}
