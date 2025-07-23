/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import type { ReactNode } from 'react';
import React from 'react';

import { Typography } from '@instana/components';

interface SloDialogSectionProps {
  title: string;
  children: ReactNode;
}
export default function SloDialogSection({ title, children }: SloDialogSectionProps) {
  return (
    <section>
      <Typography variant="heading-200" component="h2">
        {title}
      </Typography>
      {children}
    </section>
  );
}
