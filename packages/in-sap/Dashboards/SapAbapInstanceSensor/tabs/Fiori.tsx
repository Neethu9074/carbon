/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import GatewayConnections from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/GatewayConnections';
import FrontEndErrorLogs from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FrontEndErrorLogs';
import BackEndErrorLogs from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/BackEndErrorLogs';
import FioriCallMetric from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FioriCallMetric';
import FioriPageVisit from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FioriPageVisit';
import FioriServices from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FioriServices';
import FioriEntities from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FioriEntities';
import GatewayStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/GatewayStats';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { pageNames } from 'in-services/tracking/pageNames';
import { Row, Col } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function Fiori({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.abap_instance_fiori
        }}
      />
      <Row>
        <Col lg={4}>
          <FioriServices snapshotId={snapshotId} />
        </Col>
        <Col lg={4}>
          <FioriEntities snapshotId={snapshotId} />
        </Col>
      </Row>
      <GatewayConnections snapshotId={snapshotId} />
      <FrontEndErrorLogs snapshotId={snapshotId} timeConfig={timeConfig} />
      <BackEndErrorLogs snapshotId={snapshotId} timeConfig={timeConfig} />
      <GatewayStats snapshotId={snapshotId} />
      <FioriCallMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <FioriPageVisit snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
