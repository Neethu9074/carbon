/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { PropsWithChildren } from 'react';

import { SvgIcon, Typography } from '@instana/components';

import locals from './Section.mless';

interface SectionProps {
  icon: string;
  title: React.ReactElement | string;
}

export default function Section({ icon, title, children }: PropsWithChildren<SectionProps>) {
  return (
    <div className={locals.section}>
      <div className={locals.header}>
        <SvgIcon type={icon} size="l" />
        <Typography variant="heading-200" component="h3" noMargin>
          {title}
        </Typography>
      </div>
      <div className={locals.panel}>{children}</div>
    </div>
  );
}
