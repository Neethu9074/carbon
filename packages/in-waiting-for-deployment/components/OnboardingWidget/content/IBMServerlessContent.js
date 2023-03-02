/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Description, Script } from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { Col, Row as GridRow } from 'in-components/layout/Grid';

export default function IBMServerlessContent({ agentKey, serverlessEndpoint }) {
  return (
    <GridRow>
      <Col xs={6}>
        <Description lines={['INSTANA_ENDPOINT_URL']} />
        <Script lines={[serverlessEndpoint]} />
      </Col>
      <Col xs={6}>
        <Description lines={['INSTANA_AGENT_KEY']} />
        <Script lines={[agentKey]} />
      </Col>
    </GridRow>
  );
}
