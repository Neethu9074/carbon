/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { KeyValue, CarbonGrid as Grid, CarbonColumn as Column } from '@instana/components';
import { SSLCertificateValidation } from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';

import { AssertionFilterOperators, sslAssertionTypes } from 'in-synthetics/utils/constants';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/summary/tabs/configuration/Configuration.mless';

export const SSLAssertions = ({ assertions }: { assertions: SSLCertificateValidation[] }) => {
  const renderTargetValues = (): JSX.Element[] => {
    const content: JSX.Element[] = [];
    assertions.forEach((assertion, index) => {
      content.push(
        <Grid
          as="div"
          key={generateUniqueShortId()}
          className={classNames({
            [locals.configGrid]: true,
            [locals.configAssertions]: true,
            [locals.lastRow]: index === assertions.length - 1
          })}
        >
          <Column sm={3}>{sslAssertionTypes.find(attribute => attribute.value === assertion.key)?.label}</Column>
          <Column sm={3}>
            {AssertionFilterOperators.find(operator => operator.value === assertion.operator)?.label}
          </Column>
          <Column sm={3}>{assertion.value}</Column>
        </Grid>
      );
    });
    return content;
  };
  return (
    <LightCard
      className={locals.lastConfigRow}
      title={t('in-synthetics:dashboard.configuration.dns.assertionsTitle')}
      darkFrame
      framed
    >
      <Grid as="div" key={generateUniqueShortId()} className={locals.configAssertions}>
        <Column sm={3}>
          <KeyValue value={t('in-synthetics:dashboard.configuration.ssl.attributeLabel')} />
        </Column>
        <Column sm={3}>
          <KeyValue value={t('in-synthetics:dashboard.configuration.operatorLabel')} />
        </Column>
        <Column sm={3}>
          <KeyValue value={t('in-synthetics:dashboard.configuration.ssl.valueLabel')} />
        </Column>
      </Grid>
      {renderTargetValues()}
    </LightCard>
  );
};
