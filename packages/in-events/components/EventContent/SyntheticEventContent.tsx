/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

import SyntheticScopePath from 'in-alerting/smart-alerts/synthetics/components/SyntheticScopePath';
import AnalyzeSyntheticEventButton from 'in-events/components/AnalyzeSyntheticEventButton';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { fixateTimeConfig } from 'in-stores/time/config';
import { EventMap, EventOrMap } from 'in-events/types';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface Props {
  event: EventMap;
}

export default function SyntheticEventContent({ event }: Props) {
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '') as string;
  const syntheticTestId = event.getIn(['metadata', 'syntheticTestId']) as string;
  const syntheticTestLabel = event.getIn(['metadata', 'entityLabel'], '') as string;
  const locationLabel = event.getIn(['metadata', 'locations', 0, 'label'], '') as string;

  const eventTimeConfig = getTimeConfigFromEvent(event as EventOrMap);
  const analyzeTimeConfig = fixateTimeConfig(eventTimeConfig);

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <SyntheticScopePath
              syntheticTestId={syntheticTestId}
              syntheticTestLabel={syntheticTestLabel}
              locationLabel={locationLabel}
            />

            <ProblemDescription fixSuggestion={fixSuggestion} />

            <DescriptionButtons>
              <AnalyzeSyntheticEventButton
                testId={syntheticTestId}
                locationLabel={locationLabel}
                timeConfig={analyzeTimeConfig}
              />
            </DescriptionButtons>
          </Card>
        </Col>
      </Row>
    </>
  );
}
