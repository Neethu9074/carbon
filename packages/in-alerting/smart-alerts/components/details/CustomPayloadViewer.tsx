/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { Li, Ul, KeyValue } from '@instana/components';
import { DynamicFieldValue } from '@instana/types';

import * as tagBasedPayload from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { CustomPayloadCardProps } from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/details/CustomPayloadViewer.mless';

const toViewModel = tagBasedPayload.toViewModel;
export default function CustomPayloadViewer({
  customPayloadFields = [],
  TagBasedPayloadConfigurator,
  alternatingBg = false
}: CustomPayloadCardProps) {
  return (
    <Ul framed={false}>
      <Li className={locals.listItem} noAlternatingBg>
        <KeyValue className={locals.keyCell} value={t('in-alerting:components.customPayload.key')} />
        <KeyValue className={locals.valueCell} value={t('in-alerting:components.customPayload.value')} />
      </Li>
      {customPayloadFields.map(({ key, value }) => (
        <Li key={key} className={classNames(locals.listItem, locals.valueItem)} noAlternatingBg={!alternatingBg}>
          <KeyValue className={locals.keyCell} label={key} />
          <ValueCell value={value} />
        </Li>
      ))}
    </Ul>
  );

  function ValueCell({ value }: { value: string | DynamicFieldValue }) {
    if (typeof value === 'string') {
      return <KeyValue className={locals.valueCell} label={value} />;
    }

    if (!TagBasedPayloadConfigurator) return null;
    return (
      <KeyValue
        className={locals.valueCell}
        label={<TagBasedPayloadConfigurator value={toViewModel(value)} tagFilterExpression={{}} disabled />}
      />
    );
  }
}
