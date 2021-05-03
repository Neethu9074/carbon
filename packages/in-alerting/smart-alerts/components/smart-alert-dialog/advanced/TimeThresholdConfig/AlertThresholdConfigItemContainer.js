/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function AlertThresholdConfigItemContainer({ children, iconType, hasExtraColumnOnRight, noIcon }) {
  return (
    <div
      className={classNames({
        [locals.columns4]: hasExtraColumnOnRight,
        [locals.columns3]: !hasExtraColumnOnRight && !noIcon,
        [locals.itemWithLabelGrid]: !hasExtraColumnOnRight && noIcon,
        [locals.leftPaddingNoIcon]: noIcon,
        [locals.alertConfigItemContainer]: true
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
  iconType: PropTypes.string
};
