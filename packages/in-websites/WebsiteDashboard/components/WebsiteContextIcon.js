/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior/WebsiteHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import WithHealthIndication from 'in-components/health/WithHealthIndication';
import SvgIcon from 'in-components/SvgIcon';

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
