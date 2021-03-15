/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/PropContainer.mless';

export default function PropContainer({ left, right, icon }) {
  return (
    <div className={locals.propContainer}>
      <div className={locals.leftContent}>
        <div className={locals.iconWrapper}>{icon && <SvgIcon className={locals.icon} type={icon} />}</div>
        <div>{left}</div>
      </div>
      <div className={locals.rightContent}>{right}</div>
    </div>
  );
}

PropContainer.propTypes = {
  icon: PropTypes.string,
  left: PropTypes.node.isRequired,
  right: PropTypes.node.isRequired
};
