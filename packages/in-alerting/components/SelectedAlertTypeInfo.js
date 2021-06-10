/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import Pill from 'in-components/Pill';

import locals from 'in-alerting/components/SelectedAlertTypeInfo.mless';

export default function SelectedAlertTypeInfo({ title, description, svgIconType, badges = [] }) {
  return (
    <div className={locals.outerWrapper}>
      <div className={locals.innerWrapper}>
        {svgIconType && <SvgIcon className={locals.icon} type={svgIconType} />}

        {badges.length > 0 && (
          <div className={locals.badgeWrapper}>
            {badges.map((badge, index) => (
              <Pill key={index} className={locals.badge} kind="lighter">
                {badge.toUpperCase()}
              </Pill>
            ))}
          </div>
        )}

        <div>
          <span className={locals.heading}>{title}</span>
          <p className={locals.text}>{description}</p>
        </div>
      </div>
    </div>
  );
}

SelectedAlertTypeInfo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  svgIconType: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.string)
};
