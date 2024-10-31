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
  panelNoIndentation?: boolean;
}

export default function Section({ icon, title, children, panelNoIndentation }: PropsWithChildren<SectionProps>) {
  const panelClass = panelNoIndentation ? locals.panelNoIndentation : locals.panel;
  return (
    <div className={locals.section}>
      <div className={locals.header}>
        <SvgIcon type={icon} size="l" />
        <Typography variant="heading-200" component="h3" noMargin>
          {title}
        </Typography>
      </div>
      <div className={panelClass}>{children}</div>
    </div>
  );
}
