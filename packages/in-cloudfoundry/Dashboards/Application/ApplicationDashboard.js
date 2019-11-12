import React, { Fragment } from 'react';
import { get } from 'lodash';

import getApplicationServicesForCloudfoundryApplicationService from 'in-subscription/cloudfoundry/getApplicationServicesForCloudfoundryApplicationService';
import EntityToInstanaServiceButton from 'in-new-components/EntityToInstanaServiceButton/EntityToInstanaServiceButton';
import AnalyzeTracesButton from 'in-cloudfoundry/Dashboards/commonComponents/AnalyzeTracesButton';
import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import { applicationId as matrixApplicationId } from 'in-cloudfoundry/navigation/matrix';
import TechPreviewBadge from 'in-cloudfoundry/commonComponents/TechPreviewBadge';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { applicationDashboard } from 'in-cloudfoundry/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { ApplicationBreadcrumbs } from 'in-cloudfoundry/breadcrumbs';
import tabs from 'in-cloudfoundry/Dashboards/Application/tabs/index';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getTimeConfig } from 'in-stores/time/config';
import locals from './ApplicationDashboard.mless';
import WithIcon from 'in-new-components/WithIcon';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';

export default function ApplicationDashboard({ location }) {
  const props = {
    applicationId: getMatrixParameter(location, applicationDashboard, matrixApplicationId),
    viewPath: applicationDashboard,
    timeConfig: getTimeConfig(location),
    getInstanaServicesForEntityService: getApplicationServicesForCloudfoundryApplicationService
  };

  return (
    <Fragment>
      <Breadcrumbs items={ApplicationBreadcrumbs(props)} />

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
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Application"
      icon="lib_cloudfoundry_application"
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}
function Actions(props) {
  return (
    <Fragment>
      <AnalyzeTracesButton applicationId={props.applicationId} timeConfig={props.timeConfig} />
      <EntityToInstanaServiceButton
        {...props}
        getServices={() =>
          props.getInstanaServicesForEntityService({
            entityId: get(props.result, ['data', 'guid']),
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
    </Fragment>
  );
}

function SubTypes({ result }) {
  const space = get(result, ['data', 'space']);
  const organization = get(result, ['data', 'organization']);

  return (
    <Fragment>
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
      <TechPreviewBadge />
    </Fragment>
  );
}
