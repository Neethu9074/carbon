/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { Li, Ul, KeyValue } from '@instana/components';
import { DynamicFieldValue } from '@instana/types';

import * as tagBasedPayload from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { CustomPayloadCardProps } from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import Tooltip from 'in-components/Tooltip';
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
          <div className={locals.keyCell}>
            <Tooltip align="mousePosition" content={key} overflowEllipsis caret={false}>
              <KeyValue label={key} />
            </Tooltip>
          </div>
          <div className={locals.valueCell}>
            <ValueCell value={value} />
          </div>
        </Li>
      ))}
    </Ul>
  );

  function ValueCell({ value }: { value: string | DynamicFieldValue }) {
    if (typeof value === 'string') {
      return (
        <Tooltip align="mousePosition" content={value}>
          <KeyValue label={value} />
        </Tooltip>
      );
    }

    if (!TagBasedPayloadConfigurator) return null;
    return (
      <KeyValue
        label={
          <TagBasedPayloadConfigurator
            value={toViewModel(value)}
            tagFilterExpression={{}}
            disabled
            hideDestinationSourceTag
          />
        }
      />
    );
  }
}
