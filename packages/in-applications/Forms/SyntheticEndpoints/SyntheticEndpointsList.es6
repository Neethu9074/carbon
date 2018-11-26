import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  applicationId as applicationIdMatrixParameter,
  serviceId as serviceIdMatrixParameter
} from 'in-applications/navigation/matrix';
import {
  getEndpointDashboard,
  configureSyntheticEndpointsView,
  serviceDashboard
} from 'in-applications/navigation/paths';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import ServerTable from 'in-components/tables/ServerTable/ServerTable';
import getEndpoints from 'in-subscription/application/getEndpoints';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Spacer from 'in-applications/Forms/components/Spacer';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './SyntheticEndpointsList.mless';

export default connectTo({ timeConfig: timeConfig$ }, function SyntheticEndpointsList({ location, timeConfig }) {
  const title = 'Synthetic Endpoints';
  const applicationId = getMatrixParameter(location, serviceDashboard, applicationIdMatrixParameter);
  const serviceId = getMatrixParameter(location, serviceDashboard, serviceIdMatrixParameter);

  return (
    <Fragment>
      <Title title={title} />
      <div className={locals.header}>
        <h1 className={locals.heading}>{title}</h1>
        <Button
          className={locals.button}
          icon="lib_actions_settings"
          kind="action"
          href$={getModifiedUrlStream(p => (p.pathname = configureSyntheticEndpointsView))}
        >
          Configure Synthetic Endpoints
        </Button>
      </div>

      <Spacer type="dark" />

      <ServerTable
        get={getTableData}
        itemFilter={item => item.endpoint.synthetic}
        timeConfig={timeConfig}
        columnDefinitions={columnDefinitions}
        applicationId={applicationId}
        serviceId={serviceId}
        defaultOrderBy="endpointLabel"
        defaultOrderDirection="ASC"
        isSearchable={false}
      />
    </Fragment>
  );
});

function getTableData({ applicationId, serviceId, page, pageSize, orderBy, orderDirection, timeConfig, query }) {
  return getEndpoints({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      application: applicationId,
      service: serviceId,
      label: query,
      timeConfig
    },
    metrics: {
      maxSeverity: {
        metric: 'maxSeverity',
        aggregation: 'DISTINCT_COUNT'
      }
    }
  });
}

const columnDefinitions = [
  {
    id: 'endpointLabel',
    label: 'Name',
    getContent(item, { applicationId, serviceId }) {
      return (
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_application_endpoint"
          label={item.endpoint.label}
          href$={getEndpointDashboard(item.endpoint.label, { applicationId, serviceId })}
        />
      );
    }
  }
];
