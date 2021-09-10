/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import getApplicationServicesForCloudfoundryApplicationService from 'in-cloudfoundry/subscriptions/getApplicationServicesForCloudfoundryApplicationService';
import EntityToInstanaServiceButton from 'in-components/EntityToInstanaServiceButton/EntityToInstanaServiceButton';
import AnalyzeTracesButton from 'in-cloudfoundry/Dashboards/commonComponents/AnalyzeTracesButton';
import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { applicationId as matrixApplicationId } from 'in-cloudfoundry/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import { applicationDashboard } from 'in-cloudfoundry/navigation/paths';
import { ApplicationBreadcrumbs } from 'in-cloudfoundry/breadcrumbs';
import tabs from 'in-cloudfoundry/Dashboards/Application/tabs/index';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import WithIcon from 'in-components/WithIcon';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from './ApplicationDashboard.mless';

export default function ApplicationDashboard({ location }) {
  const props = {
    applicationId: getMatrixParameter(location, applicationDashboard, matrixApplicationId),
    viewPath: applicationDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
      <Breadcrumbs items={ApplicationBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'Cloud Foundry',
          pageRootName: 'CF Application'
        }}
      />

      <TabView
        result$={getCloudfoundryApplication({
          filter: {
            applicationId: props.applicationId,
            timeConfig: props.timeConfig
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.pCFApplication}
              snapshotId={props.applicationId}
              timeConfig={props.timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />

      <Footer />
    </>
  );
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-cloudfoundry:dashboards.cloudFoundryApplication')}
      icon="lib_cloudfoundry_application"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}
function renderButtonLine(props) {
  const appGuid = get(props.result, ['data', 'guid']);
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        timeConfig={props.timeConfig}
        snapshotId={props.applicationId}
      />
      {appGuid && (
        <EntityToInstanaServiceButton
          {...props}
          getServices={() =>
            getApplicationServicesForCloudfoundryApplicationService({
              entityId: appGuid,
              timeConfig: props.timeConfig,
              order: {
                by: 'callsAgg',
                direction: 'DESC'
              },
              metrics: {
                callsAgg: {
                  metric: 'calls',
                  aggregation: 'SUM'
                },
                latencyAgg: {
                  metric: 'latency',
                  aggregation: 'MEAN'
                },
                errorsAgg: {
                  metric: 'errors',
                  aggregation: 'MEAN'
                },
                maxSeverity: {
                  metric: 'maxSeverity',
                  aggregation: 'MAX'
                }
              }
            })
          }
        />
      )}
      <AnalyzeTracesButton applicationId={props.applicationId} timeConfig={props.timeConfig} />
    </>
  );
}

function renderMetaInformation({ result }) {
  const space = get(result, ['data', 'space']);
  const organization = get(result, ['data', 'organization']);
  const foundation = get(result, ['data', 'foundation']);

  return (
    <>
      {space && (
        <Tooltip themeStyle="light" content={`Space: ${space}`}>
          <WithIcon className={locals.icon} icon="lib_cloudfoundry_space">
            <span className={locals.label}>{space}</span>
          </WithIcon>
        </Tooltip>
      )}
      {organization && (
        <Tooltip themeStyle="light" content={`Organization: ${organization}`}>
          <WithIcon className={locals.icon} icon="lib_cloudfoundry_organization">
            <span className={locals.label}>{organization}</span>
          </WithIcon>
        </Tooltip>
      )}
      {foundation && (
        <Tooltip themeStyle="light" content={`Foundation: ${foundation}`}>
          <WithIcon className={locals.icon} icon="lib_cloudfoundry_foundation">
            <span className={locals.label}>{foundation}</span>
          </WithIcon>
        </Tooltip>
      )}
    </>
  );
}
