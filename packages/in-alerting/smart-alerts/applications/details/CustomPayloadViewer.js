/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Li, Ul } from '@instana/components';

import { t } from 'in-i18n';

import locals from './CustomPayloadViewer.mless';

export default function CustomPayloadViewer({ customPayloadFields = [] }) {
  return (
    <Ul>
      {customPayloadFields.map(({ key, value }) => (
        <Li key={key} className={locals.listItem} noAlternatingBg>
          <KeyValueRow className={locals.keyLine} label={t('in-alerting:components.customPayload.key')} value={key} />
          <KeyValueRow
            className={locals.valueLine}
            label={t('in-alerting:components.customPayload.value')}
            value={value}
          />
        </Li>
      ))}
    </Ul>
  );
}

function KeyValueRow({ label, value, className }) {
  return (
    <div className={classNames(locals.keyValueLine, className)}>
      <span className={locals.key}>{label}:</span>
      <span className={locals.value}>{value}</span>
    </div>
  );
}

CustomPayloadViewer.propTypes = {
  customPayloadFields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  )
};
