/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { TestResponse } from 'in-synthetics/utils/constants';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

interface Props {
  test: TestResponse;
}

const TestTypeSection = ({ test }: Props) => {
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.testTypeTitle')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <Row>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.testType')}
            value={test.data.configuration.syntheticType}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.subType')}
            value={test.data.configuration.syntheticType}
          />
        </Col>
      </Row>
    </ExpandableLightCard>
  );
};

export default TestTypeSection;
