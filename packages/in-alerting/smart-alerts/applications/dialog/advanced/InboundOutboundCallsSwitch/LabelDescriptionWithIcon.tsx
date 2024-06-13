/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer, SvgIcon } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';

import locals from './LabelDescriptionWithIcon.mless';

export default function LabelDescriptionWithIcon(icon: string, label: string, description: string) {
  return (
    <div className={locals.wrapper}>
      {icon && <SvgIcon type={icon} className={locals.icon} />}
      <div className={locals.content}>
        <AlertTypography variant="body-bold" color="color900" content={label} />
        <Spacer vertical="xsmall" />
        <AlertTypography variant="body-small" color="color600" content={description} />
      </div>
    </div>
  );
}
