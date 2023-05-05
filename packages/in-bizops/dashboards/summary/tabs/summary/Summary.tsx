/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/summary/tabs/summary/components/InfrastructureIssuesAndChanges';
import TopActivities from 'in-bizops/dashboards/summary/tabs/summary/components/TopActivities';
import Timeline from 'in-bizops/dashboards/summary/tabs/summary/components/Timeline';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Col, Row } from 'in-components/layout/Grid';

export default function Summary() {
  const timeShiftConfig = useTimeShiftConfig();

  return (
    <Fragment>
      <Row>
        <Col xs>
          <Timeline timeShiftConfig={timeShiftConfig} />
        </Col>
        <Col xs>
          <TopActivities />
        </Col>
        <Col xs>
          <InfrastructureIssuesAndChanges />
        </Col>
      </Row>
    </Fragment>
  );
}
