/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';

import { Typography } from '@instana/components';

import locals from './ContentSection.mless';

interface ContentSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const ContentSection = ({ title, description, children }: ContentSectionProps): JSX.Element => {
  return (
    <div>
      <div className={locals.headerSection}>
        <Typography variant="heading-03">{title}</Typography>
        <Typography variant="body-01">{description}</Typography>
      </div>
      <div>{children}</div>
    </div>
  );
};
