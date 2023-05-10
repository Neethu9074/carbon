/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { Col, Row } from 'in-components/layout/Grid/Grid';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

const ConfigSection = () => {
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.configSectionTitle')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.operation')} value={'GET'} />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.url')}
            value={'http://www.myurl.com/test-this-url'}
          />
        </Col>
      </Row>
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.header')} value={'header1'} />
        </Col>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.value')} value={'value1'} />
        </Col>
      </Row>
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.body')} value={'body of the input'} />
        </Col>
      </Row>
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue
            label={t('in-synthetics:dashboard.configuration.validationString')}
            value={'validate this, please'}
          />
        </Col>
      </Row>
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.expectStatus')} value={200} />
        </Col>
      </Row>
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.expectMatch')} value={'match this string'} />
        </Col>
      </Row>
      <Row className={locals.configRow}>
        <Col xs={3}>
          <KeyValue label={t('in-synthetics:dashboard.configuration.expectJSON')} value={'{json:data array: {}}'} />
        </Col>
      </Row>
      <Row>
        <LightCard
          className={locals.lastConfigRow}
          title={t('in-synthetics:dashboard.configuration.additionalOptionsTitle')}
          darkFrame
          useMaxAvailableHeight
        >
          <Row>{t('in-synthetics:dashboard.configuration.followRedirect')}</Row>
          <Row>{t('in-synthetics:dashboard.configuration.allowInsecure')}</Row>
        </LightCard>
      </Row>
    </ExpandableLightCard>
  );
};

export default ConfigSection;
