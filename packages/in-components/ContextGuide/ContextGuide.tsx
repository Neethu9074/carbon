/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ButtonSizes } from '@instana/components';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import UpstreamDownstreamButton from 'in-components/UpstreamDownstream/UpstreamDownstreamButton';
// @ts-expect-error needs TS migration
import StackButton from 'in-components/Stack/StackButton';
import { ApplicationTagFilter } from 'in-analyze/applicationFilter';

import locals from './ContextGuide.mless';

interface ContextGuideProps {
  id: string;
  serviceId?: string;
  applicationId?: string;
  boundaryScope?: string;
  endpointId?: string;
  timeConfig: TimeConfig;
  productArea?: string;
  tagFilters?: ApplicationTagFilter[];
  includeSelfEntity?: boolean;
  plugin?: string;
  syntheticCalls?: any;
  size?: keyof typeof ButtonSizes;
}
export default function ContextGuide({
  id,
  serviceId,
  applicationId,
  boundaryScope,
  endpointId,
  timeConfig,
  productArea,
  tagFilters,
  includeSelfEntity = false,
  plugin,
  syntheticCalls,
  size
}: ContextGuideProps) {
  return (
    <>
      <StackButton
        id={id}
        applicationId={applicationId}
        boundaryScope={boundaryScope}
        serviceId={serviceId}
        timeConfig={timeConfig}
        productArea={productArea}
        className={locals.leftButton}
        includeSelfEntity={includeSelfEntity}
        plugin={plugin}
        syntheticCalls={syntheticCalls}
        noAutoMargin
        size={size}
      />
      <UpstreamDownstreamButton
        snapshotId={id}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
        className={locals.rightButton}
        tagFilters={tagFilters}
        plugin={plugin}
        size={size}
      />
    </>
  );
}
