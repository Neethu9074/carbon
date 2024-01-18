/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, Pill } from '@instana/components';

import { useTheme } from 'in-themes';

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
  const theme = useTheme();
  const svgIconColor = darkSvgIcon ? theme.ids.color.option.neutral['700'] : theme.ids.color.option.neutral['300'];
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
