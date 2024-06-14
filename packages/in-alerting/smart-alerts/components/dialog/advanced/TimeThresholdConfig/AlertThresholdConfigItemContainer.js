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
  isFiveColumnInTearSheet
}) {
  return (
    <div
      className={classNames({
        [locals.columns4]: hasExtraColumnOnRight,
        [locals.columns3]: !hasExtraColumnOnRight && !noIcon,
        [locals.itemWithLabelGrid]: !isTearSheet && !hasExtraColumnOnRight && noIcon,
        [locals.columns3TearSheet]: isTearSheet,
        [locals.columns5TearSheet]: isFiveColumnInTearSheet,
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
  isFiveColumnInTearSheet: PropTypes.bool,
  iconType: PropTypes.string
};
