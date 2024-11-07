/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup.mless';

interface ThresholdConditionFormGroupPros {
  children?: ReactNode;
  iconType?: string;
  label?: string;
  shouldIncreaseColumns?: boolean;
  hasWhiteBackground?: boolean;
  isTearSheet?: boolean;
  showLabel?: boolean;
  isMultiThreshold?: boolean;
}
export default function ThresholdConditionFormGroup({
  children,
  iconType = 'lib_alerting_threshold_icon',
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold'),
  shouldIncreaseColumns = false,
  hasWhiteBackground = false,
  isTearSheet = false,
  showLabel = true,
  isMultiThreshold = false
}: ThresholdConditionFormGroupPros) {
  return (
    <div
      className={classNames({
        [locals.thresholdConditionItem]: true,
        [locals.thresholdConditionItemTearSheet]: isTearSheet,
        [locals.increasedColumns]: shouldIncreaseColumns,
        [locals.whiteBackground]: hasWhiteBackground
      })}
    >
      {!isTearSheet && <SvgIcon className={locals.icon} type={iconType} />}
      {showLabel && (
        <span className={classNames({ [locals.label]: true, [locals.tearSheetLabel]: isTearSheet })}>
          {isTearSheet && !isMultiThreshold && (
            <AlertTypography variant="body-regular" color="color900" content={label} />
          )}
          {!isTearSheet && label}
        </span>
      )}
      <div
        className={classNames({
          [locals.content]: true,
          [locals.extraGap]: !isTearSheet,
          [locals.alignStart]: isTearSheet
        })}
      >
        {children}
      </div>
    </div>
  );
}
