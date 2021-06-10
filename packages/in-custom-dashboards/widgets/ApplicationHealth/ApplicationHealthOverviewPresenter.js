/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

import ApplicationsHealthIndicatorBar from 'in-components/ApplicationHealthOverview/ApplicationsHealthIndicatorBar';
import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ApplicationHealthOverview from 'in-components/ApplicationHealthOverview';
import { compareIgnoreCase } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { compare } from 'in-services/util/number';
import { t } from 'in-i18n';

import locals from './ApplicationHealthOverviewPresenter.mless';

const ApplicationHealthOverviewPresenter = ({ config, isPreview, title, dragHandle, actions }) => {
  const timeConfig = useTimeConfig();
  const appsAndHealthInfo = useObservable(() => getHealthStatusForApps(config, timeConfig), [config, timeConfig]);
  const configWithSeverity = appsAndHealthInfo?.configWithHealthInfo || [];
  const overallHealthStatus = appsAndHealthInfo?.overallHealthStatus || {};

  return (
    <Card
      title={title}
      withoutPadding
      useMaxAvailableHeight={!isPreview}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
    >
      {!appsAndHealthInfo?.configWithHealthInfo && <LoadingIndicator />}
      {appsAndHealthInfo?.configWithHealthInfo && (
        <>
          <div className={locals.container}>
            <div className={locals.indicatorBar}>
              <ApplicationsHealthIndicatorBar
                critical={overallHealthStatus?.critical}
                warning={overallHealthStatus?.warning}
                total={overallHealthStatus?.total}
                label={t('in-components:applicationHealthOverview.indicatorBar.label')}
              />
            </div>
            <ApplicationHealthOverview
              applications={configWithSeverity}
              isPreview={isPreview}
              timeConfig={timeConfig}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default ApplicationHealthOverviewPresenter;

/**
 * Iterate through the applications and combine the observables to be used insude useObservables later
 * throttling of 100ms has been given to avoid frequent changes in the DOM
 *
 * @param {Array} applications
 */
function getHealthStatusForApps(applications, timeConfig) {
  const healthInfosObservables = applications.map(({ id }) => {
    return getApplicationEntityHealthInfo({
      applicationId: id,
      timeConfig
    });
  });

  return combineLatest(healthInfosObservables, false)
    .nextFrame()
    .map(applicationsHealthData => {
      const configWithHealthInfo = mergeAndSortAppsWithHealthInfo(applications, applicationsHealthData);
      const overallHealthStatus = calculateOverallhealthStatus(configWithHealthInfo);
      return { configWithHealthInfo, overallHealthStatus };
    })
    .throttle(100);
}

function mergeAndSortAppsWithHealthInfo(applications, healthInfo) {
  return applications
    .map((application, i) => {
      return {
        ...application,
        maxSeverity: healthInfo?.[i]?.data?.maxSeverity,
        openIssues: healthInfo?.[i]?.data?.openIssues?.length
      };
    })
    .sort((a, b) => compareIgnoreCase(a.label, b.label))
    .sort((a, b) => compare(b.maxSeverity, a.maxSeverity));
}

function calculateOverallhealthStatus(applications = []) {
  const healthStatus = {
    critical: 0,
    warning: 0,
    total: applications.length
  };
  applications.forEach(({ maxSeverity, openIssues }) => {
    if (openIssues > 0) {
      if (maxSeverity > 5) {
        healthStatus.critical++;
      } else if (maxSeverity > 0) {
        healthStatus.warning++;
      }
    }
  });
  return healthStatus;
}
