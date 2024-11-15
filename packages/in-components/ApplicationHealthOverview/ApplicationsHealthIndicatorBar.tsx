/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ApplicationsHealthIndicatorBar.mless';

const ApplicationsHealthIndicatorBar = ({
  critical = 0,
  warning = 0,
  total = 0,
  label
}: {
  critical: number;
  warning: number;
  total: number;
  label: string;
}) => {
  const barStyle = {
    critical: {
      flex: critical
    },
    warning: {
      flex: warning
    },
    healthy: {
      flex: total - critical - warning
    }
  };
  return (
    <Stack gap="xsmall">
      {label && <label className={locals.label}>{label}</label>}
      <div className={locals.healthBar}>
        <Tooltip
          content={t('in-components:applicationHealthOverview.indicatorBar.criticalTooltip', { count: critical })}
          align="mousePosition"
          legacy
        >
          <div className={locals.critical} style={barStyle.critical} />
        </Tooltip>
        <Tooltip
          content={t('in-components:applicationHealthOverview.indicatorBar.warningTooltip', { count: warning })}
          align="mousePosition"
          legacy
        >
          <div className={locals.warning} style={barStyle.warning} />
        </Tooltip>
        <Tooltip
          content={t('in-components:applicationHealthOverview.indicatorBar.healthyTooltip', {
            count: total - critical - warning
          })}
          align="mousePosition"
          legacy
        >
          <div className={locals.healthy} style={barStyle.healthy} />
        </Tooltip>
      </div>
    </Stack>
  );
};

ApplicationsHealthIndicatorBar.propTypes = {
  critical: PropTypes.number,
  warning: PropTypes.number,
  total: PropTypes.number,
  label: PropTypes.string
};

export default ApplicationsHealthIndicatorBar;
