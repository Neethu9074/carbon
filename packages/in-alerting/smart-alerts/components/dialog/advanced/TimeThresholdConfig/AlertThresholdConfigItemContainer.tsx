/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export interface AlertThresholdConfigItemContainerProps {
  children: ReactNode;
  hasExtraColumnOnRight?: boolean;
  noIcon?: boolean;
  isTearSheet?: boolean;
  isTwoColumns?: boolean;
  isFourColumns?: boolean;
  isColumns3WithError?: boolean;
  isTSFiveColumn?: boolean;
  isTSColumn5WithErrorOnBothField?: boolean;
  isTSColumn5WithErrorOn1stField?: boolean;
  iconType?: string;
}

export default function AlertThresholdConfigItemContainer({
  children,
  iconType = '',
  hasExtraColumnOnRight,
  noIcon,
  isTearSheet,
  isTwoColumns,
  isFourColumns,
  isColumns3WithError,
  isTSFiveColumn,
  isTSColumn5WithErrorOnBothField,
  isTSColumn5WithErrorOn1stField
}: AlertThresholdConfigItemContainerProps) {
  return (
    <div
      className={classNames({
        [locals.columns4]: hasExtraColumnOnRight,
        [locals.columns2TS]: isTearSheet && isTwoColumns,
        [locals.rowWith4columns]: isTearSheet && isFourColumns,
        [locals.columns3]: !hasExtraColumnOnRight && !noIcon,
        [locals.itemWithLabelGrid]: !isTearSheet && !hasExtraColumnOnRight && noIcon,
        [locals.columns3TS]: isTearSheet && !isColumns3WithError,
        [locals.columns3TSWithError]: isTearSheet && isColumns3WithError,
        [locals.columns5TS]: isTSFiveColumn,
        [locals.columns5TSFirstFieldError]: isTSColumn5WithErrorOn1stField,
        [locals.columns5TSBothFieldError]: isTSColumn5WithErrorOnBothField,
        [locals.leftPaddingNoIcon]: !isTearSheet && noIcon,
        [locals.alertConfigItemContainer]: true,
        [locals.timeThresholdFieldContainer]: isTearSheet
      })}
    >
      {!noIcon && <SvgIcon className={locals.icon} type={iconType} />}
      {children}
    </div>
  );
}
