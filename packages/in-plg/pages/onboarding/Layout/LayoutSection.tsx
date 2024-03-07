/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

import locals from 'in-plg/pages/onboarding/Layout/LayoutSection.mless';

interface LayoutSectionProps {
  title: string;
  children: JSX.Element | null;
}

const LayoutSection: React.FC<LayoutSectionProps> = ({ title, children }) => {
  return (
    <Stack gap="medium">
      <Typography variant="body-bold">{title}</Typography>
      <div className={locals.childrenBlock}>{children}</div>
    </Stack>
  );
};

export default LayoutSection;
