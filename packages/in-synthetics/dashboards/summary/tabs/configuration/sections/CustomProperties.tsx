/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isEmpty } from 'lodash';
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

const renderCustomProperties = (customProperties: { [index: string]: string }) => {
  const content = [];
  for (const property in customProperties) {
    content.push(
      <Row key={property} className={locals.configRow}>
        <Col xs={3}>{property}</Col>
        <Col xs={3}>{customProperties[property]}</Col>
      </Row>
    );
  }
  return content;
};

const isValidToRenderCustomProperties = (customProperties: { [index: string]: string }) => {
  let emptyString: boolean = false;

  if (Object.keys(customProperties).length === 1) {
    const value = customProperties[Object.keys(customProperties)[0]];
    if (value === '') {
      emptyString = true;
    }
  }

  return isEmpty(customProperties) || emptyString;
};

const renderCompleteView = (customProperties: { [index: string]: string }) => {
  const toRender = [
    <Row key={'customProperties'} className={locals.configRow} withoutTopMargin>
      <Col xs={3}>
        <KeyValue value={t('in-synthetics:dashboard.configuration.propertyTitle')} />
      </Col>
      <Col xs={3}>
        <KeyValue value={t('in-synthetics:dashboard.configuration.valueTitle')} />
      </Col>
    </Row>,
    renderCustomProperties(customProperties || {})
  ];
  return toRender;
};

const CustomProperties = ({ test }: Props) => {
  return (
    <ExpandableLightCard
      className={locals.expandableCard}
      title={t('in-synthetics:dashboard.configuration.customProperties')}
      darkFrame
      useMaxAvailableHeight
      openByDefault
    >
      {isValidToRenderCustomProperties(test.customProperties || {})
        ? t('in-synthetics:dashboard.configuration.noCustomProperties')
        : renderCompleteView(test.customProperties || {})}
    </ExpandableLightCard>
  );
};

export default CustomProperties;
