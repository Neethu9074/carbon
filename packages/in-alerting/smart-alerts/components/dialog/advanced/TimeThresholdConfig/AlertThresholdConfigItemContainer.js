/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function AlertThresholdConfigItemContainer({
  children,
  iconType,
  hasExtraColumnOnRight,
  noIcon,
  isTearSheet,
  isColumns3WithError,
  isTSFiveColumn,
  isTSColumn5WithErrorOnBothField,
  isTSColumn5WithErrorOn1stField
}) {
  return (
    <div
      className={classNames({
        [locals.columns4]: hasExtraColumnOnRight,
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

AlertThresholdConfigItemContainer.propTypes = {
  children: PropTypes.node.isRequired,
  hasExtraColumnOnRight: PropTypes.bool,
  noIcon: PropTypes.bool,
  isTearSheet: PropTypes.bool,
  isColumns3WithError: PropTypes.bool,
  isTSFiveColumn: PropTypes.bool,
  isTSColumn5WithErrorOnBothField: PropTypes.bool,
  isTSColumn5WithErrorOn1stField: PropTypes.bool,
  iconType: PropTypes.string
};
