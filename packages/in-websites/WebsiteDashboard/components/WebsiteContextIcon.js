/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior/WebsiteHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import WithHealthIndication from 'in-components/health/WithHealthIndication';

export default function WebsiteContextIcon({ className, websiteId, timeConfig }) {
  return (
    <WebsiteHealthIndicatorBehavior
      IndicatorPresenter={HealthIndicatorButtonPresenter}
      websiteId={websiteId}
      timeConfig={timeConfig}
      render={healthInfo => (
        <WithHealthIndication healthInfo={healthInfo} iconSize="l">
          <SvgIcon className={className} type="lib_website" size="l" />
        </WithHealthIndication>
      )}
    />
  );
}
