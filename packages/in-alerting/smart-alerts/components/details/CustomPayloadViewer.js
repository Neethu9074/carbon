/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Li, Ul, KeyValue } from '@instana/components';

import { toViewModel } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/details/CustomPayloadViewer.mless';

export default function CustomPayloadViewer({
  customPayloadFields = [],
  TagBasedPayloadConfigurator,
  alternatingBg = false
}) {
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

  function ValueCell({ value }) {
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

CustomPayloadViewer.propTypes = {
  TagBasedPayloadConfigurator: PropTypes.func,
  customPayloadFields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
    })
  ),
  alternatingBg: PropTypes.bool
};
