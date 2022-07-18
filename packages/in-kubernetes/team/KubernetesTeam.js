/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import exploreK8sMansoorInTeam from '../subscriptions/exploreK8sMansoorInTeam';
import exploreK8sNateInTeam from '../subscriptions/exploreK8sNateInTeam';
import { Col, Row } from '../../in-components/layout/Grid';
import TeamMember from './TeamMember';

export const mainCols = 12;

export default function KubernetesTeam() {
  // Adding Nate
  const nateStartingEpoch = 1558089743; // Start date in Epoch
  const nateTimeConfig = {
    to: nateStartingEpoch,
    focusedMoment: nateStartingEpoch,
    windowSize: 600000
  };
  const nateResult = useObservable(exploreK8sNateInTeam({ timeConfig: nateTimeConfig }), []);
  const nateData = nateResult?.data;

  // Add Mansoor
  const mansoorStartingEpoch = 1621248143; // Start date in Epoch
  const mansoorTimeConfig = {
    to: mansoorStartingEpoch,
    focusedMoment: mansoorStartingEpoch,
    windowSize: 600000
  };
  const mansoorResult = useObservable(exploreK8sMansoorInTeam({ timeConfig: mansoorTimeConfig }), []);
  const mansoorData = mansoorResult?.data;

  return (
    <div>
      <Row>
        <Col md={mainCols}>
          {nateData && <TeamMember {...nateData} />}
          {mansoorData && <TeamMember {...mansoorData} />}
        </Col>
      </Row>
    </div>
  );
}
