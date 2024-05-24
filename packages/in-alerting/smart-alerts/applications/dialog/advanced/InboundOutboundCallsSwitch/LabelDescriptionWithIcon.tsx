/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon, Typography } from '@instana/components';

import locals from './LabelDescriptionWithIcon.mless';

export default function LabelDescriptionWithIcon(icon: string, label: string, description: string) {
  return (
    <div className={locals.wrapper}>
      <SvgIcon type={icon} className={locals.icon} />
      <div className={locals.content}>
        <Typography variant="body-bold" noMargin>
          <span className={locals.color900}>{label}</span>
        </Typography>
        <div className={locals.description}>
          <Typography variant="body-small" noMargin>
            <span className={locals.color600}>{description}</span>
          </Typography>
        </div>
      </div>
    </div>
  );
}
