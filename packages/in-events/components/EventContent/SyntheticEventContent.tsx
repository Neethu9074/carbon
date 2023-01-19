/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

import SyntheticScopePath from 'in-alerting/smart-alerts/synthetics/components/SyntheticScopePath';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { Row, Col } from 'in-components/layout/Grid';
import { EventMap } from 'in-events/types';
import { t } from 'in-i18n';

interface Props {
  event: EventMap;
}

export default function SyntheticEventContent({ event }: Props) {
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const syntheticTestId = event.getIn(['metadata', 'syntheticTestId'], undefined);
  const syntheticTestLabel = event.getIn(['metadata', 'entityLabel'], '');
  const locationLabel = event.getIn(['metadata', 'locations', 0, 'label'], '');

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <SyntheticScopePath syntheticTestId={syntheticTestId} syntheticTestLabel={syntheticTestLabel} locationLabel={locationLabel} />

            <ProblemDescription fixSuggestion={fixSuggestion} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
