/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/IncompleteChartPlaceholder.mless';

export default function IncompleteChartPlaceholder({ message }) {
  return (
    <div className={locals.message}>
      <SvgIcon type="lib_help_error_error_outline" size="xs" />
      <span>{message}</span>
    </div>
  );
}

IncompleteChartPlaceholder.propTypes = {
  message: PropTypes.string.isRequired
};
