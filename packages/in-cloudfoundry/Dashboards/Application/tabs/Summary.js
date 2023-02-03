/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ApplicationState from 'in-cloudfoundry/commonComponents/ApplicationState';
import Containers from 'in-cloudfoundry/Dashboards/Application/tabs/Containers';
import InstanceMetric from 'in-cloudfoundry/commonComponents/InstanceMetric';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DateTimeKpiCard from 'in-components/KpiCard/DateTimeKpiCard';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export default function Summary({ data: application, timeConfig }) {
  const joinedRoutes = application.routes.join(', ');

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title={t('in-cloudfoundry:dashboards.requestedState')} borderless raw>
          <ApplicationState state={application.status} />
        </KpiCard>
        <KpiCard title={t('in-cloudfoundry:dashboards.instances')} borderless raw>
          <InstanceMetric applicationId={application.id} />{' '}
        </KpiCard>
        <KpiCard
          title={t('in-cloudfoundry:dashboards.memoryLimit')}
          value={application.memoryLimit}
          renderValue={bytesZeroDecimalPlaces}
          borderless
          raw
        />
        <DateTimeKpiCard
          title={t('in-cloudfoundry:dashboards.lastUpdated')}
          time={application.lastUpdated}
          borderless
        />
      </KpiGridRow>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard
          title={t('in-cloudfoundry:dashboards.buildpack')}
          value={application.buildpack}
          renderValue={buildpack => (
            <Tooltip themeStyle="light" align="bottomLeft" content={buildpack}>
              <span>{buildpack}</span>
            </Tooltip>
          )}
          borderless
          raw
        />
        <KpiCard
          title={t('in-cloudfoundry:dashboards.routes')}
          value={joinedRoutes}
          renderValue={routes => (
            <Tooltip themeStyle="light" align="bottomLeft" content={routes}>
              <span>{routes}</span>
            </Tooltip>
          )}
          borderless
          raw
        />
        <KpiCard
          title={t('in-cloudfoundry:dashboards.diskLimit')}
          value={application.diskLimit}
          renderValue={bytesZeroDecimalPlaces}
          borderless
          raw
        />
        <DateTimeKpiCard title={t('in-cloudfoundry:dashboards.createdAt')} time={application.createdAt} borderless />
      </KpiGridRow>

      <Row>
        <Col lg={12}>
          <Containers applicationId={application.id} timeConfig={timeConfig} />
        </Col>
      </Row>
    </Fragment>
  );
}
