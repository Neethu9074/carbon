/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import exploreK8sMansoorInTeam from 'in-kubernetes/subscriptions/exploreK8sMansoorInTeam';
import exploreK8sNateInTeam from 'in-kubernetes/subscriptions/exploreK8sNateInTeam';
import { Col, Row } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';

export const mainCols = 12;

export default function KubernetesTeam() {
  const timeConfig = useTimeConfig();
  // Adding Nate
  const nateResult = useObservable(exploreK8sNateInTeam({ timeConfig }), [timeConfig]);
  const nateData = nateResult?.data;

  // Add Mansoor
  const mansoorResult = useObservable(exploreK8sMansoorInTeam({ timeConfig }), [timeConfig]);
  const mansoorData = mansoorResult?.data;

  return (
    <div>
      <Row>
        <Col md={mainCols}>
          {nateData && <p> {nateData.name} </p>}
          {mansoorData && <p> {mansoorData.name} </p>}
        </Col>
      </Row>
    </div>
  );
}
