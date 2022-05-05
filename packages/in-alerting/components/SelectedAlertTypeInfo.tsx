/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import Pill from 'in-components/Pill';
import theme from 'in-themes';

import locals from 'in-alerting/components/SelectedAlertTypeInfo.mless';

interface Props {
  title: string;
  description: string;
  svgIconType?: string;
  darkSvgIcon?: boolean;
  badges?: string[];
}

export default function SelectedAlertTypeInfo({
  title,
  description,
  svgIconType,
  darkSvgIcon = false,
  badges = []
}: Props) {
  const svgIconColor = darkSvgIcon ? theme.lib.colors.N700Medium : theme.lib.colors.N300;
  return (
    <div className={locals.outerWrapper}>
      <div className={locals.innerWrapper}>
        {svgIconType && <SvgIcon className={locals.icon} type={svgIconType} color={svgIconColor} />}

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
