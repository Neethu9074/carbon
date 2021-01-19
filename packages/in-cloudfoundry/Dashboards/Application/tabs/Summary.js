/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import ApplicationState from 'in-cloudfoundry/commonComponents/ApplicationState';
import Containers from 'in-cloudfoundry/Dashboards/Application/tabs/Containers';
import InstanceMetric from 'in-cloudfoundry/commonComponents/InstanceMetric';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import Tooltip from 'in-components/Tooltip';

export default function Summary({ data: application, timeConfig }) {
  const joinedRoutes = application.routes.join(', ');

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title="Requested State" value={<ApplicationState state={application.status} />} borderless raw />
        <KpiCard title="Instances" value={<InstanceMetric applicationId={application.id} />} borderless raw />
        <KpiCard
          title="Memory Limit"
          value={application.memoryLimit ? bytesZeroDecimalPlaces(application.memoryLimit) : valueMissingPlaceholder}
          borderless
          raw
        />
        <DateTimeKpiCard title="Last Updated" time={application.lastUpdated} borderless />
      </KpiGridRow>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard
          title="Buildpack"
          value={
            application.buildpack ? (
              <Tooltip themeStyle="light" align="bottomLeft" content={application.buildpack}>
                <span>{application.buildpack}</span>
              </Tooltip>
            ) : (
              valueMissingPlaceholder
            )
          }
          borderless
          raw
        />
        <KpiCard
          title="Routes"
          value={
            joinedRoutes ? (
              <Tooltip themeStyle="light" align="bottomLeft" content={joinedRoutes}>
                <span>{joinedRoutes}</span>
              </Tooltip>
            ) : (
              valueMissingPlaceholder
            )
          }
          borderless
          raw
        />
        <KpiCard
          title="Disk Limit"
          value={application.diskLimit ? bytesZeroDecimalPlaces(application.diskLimit) : valueMissingPlaceholder}
          borderless
          raw
        />
        <DateTimeKpiCard title="Created at" time={application.createdAt} borderless />
      </KpiGridRow>

      <Row>
        <Col lg={12}>
          <Containers applicationId={application.id} timeConfig={timeConfig} />
        </Col>
      </Row>
    </Fragment>
  );
}
