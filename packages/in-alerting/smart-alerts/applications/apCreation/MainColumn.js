/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Stack, SvgIcon } from '@instana/components';

import LabelText from 'in-alerting/smart-alerts/applications/apCreation/LabelText';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { t } from 'in-i18n';

import locals from './MainColumn.mless';

export default function MainColumn({
  alertIds = [],
  name,
  id,
  onItemSelect,
  severity,
  customLabel,
  isIndeterminate,
  disabled,
  index
}) {
  const isWarning = severity <= 5;

  return (
    <CheckboxFancy
      id={`select-built-in-alert${index}`}
      name={`select-built-in-alert${index}`}
      size="large"
      onChange={e => {
        onItemSelect(e.target.checked);
      }}
      label={
        <Stack gap="xsmall" direction="horizontal" align="center">
          <SvgIcon
            className={classNames({
              [locals.iconWarning]: isWarning,
              [locals.iconCritical]: !isWarning
            })}
            type={isWarning ? 'lib_events_warning' : 'lib_events_critical'}
            aria-label={
              isWarning
                ? t('in-alerting:smartAlerts.applications.apCreation.eventsWarningIcon')
                : t('in-alerting:smartAlerts.applications.apCreation.eventsCriticalIcon')
            }
          />
          <div className={locals.labelTextWrapper}>{customLabel?.() ?? <LabelText>{name}</LabelText>}</div>
        </Stack>
      }
      checked={isIndeterminate ? null : alertIds.includes(id)}
      indeterminate={isIndeterminate}
      disabled={disabled}
    />
  );
}

MainColumn.propTypes = {
  alertIds: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string,
  customLabel: PropTypes.func,
  name: PropTypes.string.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  severity: PropTypes.number.isRequired,
  isIndeterminate: PropTypes.bool,
  disabled: PropTypes.bool,
  index: PropTypes.number
};
