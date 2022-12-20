/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card } from '@instana/components';

import HorizontalFlexWrapper from '../../../in-components/layout/HorizontalFlexWrapper';
import useInfraEventAlertConfig from 'in-events/hooks/useInfraEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import { Row, Col } from 'in-components/layout/Grid';
import PluginIcon from 'in-components/PluginIcon';
import { t } from 'in-i18n';

import locals from './InfraEventContent.mless';

export default function InfraEventContent({ event }) {
  const alertConfig = useInfraEventAlertConfig(event);

  if (!alertConfig) {
    return null;
  }

  const entityName = event.getIn(['metadata', 'entityName'], '');
  const entityType = alertConfig.rule.entityType;

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <HorizontalFlexWrapper>
              <PluginIcon className={locals.icon} size="s" plugin={entityType} />
              {t('in-events:infraSmartAlerts.pseudoAggregatedEntityLabel', { entityName: entityName })}
            </HorizontalFlexWrapper>

            <ProblemDescription event={event} className="in-event-view-event-content" />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleMetrics')}>
            <span>TBD</span>
          </Card>
        </Col>
      </Row>
    </>
  );
}
