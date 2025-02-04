/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder.mless';

export default function IncompleteChartPlaceholder({
  message,
  isTearSheet = false
}: {
  message: string;
  isTearSheet?: boolean;
}) {
  return (
    <div className={classNames({ [locals.message]: true, [locals.whiteBackground]: isTearSheet })}>
      <SvgIcon type="lib_help_error_error_outline" size="xs" />
      <span>{message}</span>
    </div>
  );
}
