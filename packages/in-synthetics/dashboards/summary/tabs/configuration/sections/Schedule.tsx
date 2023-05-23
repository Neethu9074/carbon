/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticTest } from '@instana/types/typeDefinitions';
import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: SyntheticTest;
}

const Schedule = ({ test }: Props) => {
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.scheduleTitle')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.scheduleTitle')}
            value={t('in-synthetics:dashboard.configuration.simultaneousValue')}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.frequencyTitle')}
            value={
              test.testFrequency && test.testFrequency > 1
                ? t('in-synthetics:dashboard.configuration.frequencyPluralValue', {
                    minutes: test.testFrequency
                  })
                : t('in-synthetics:dashboard.configuration.frequencySingleValue', {
                    minutes: test.testFrequency
                  })
            }
          />
        </Col>
      </Row>
    </ExpandableLightCard>
  );
};

export default Schedule;
