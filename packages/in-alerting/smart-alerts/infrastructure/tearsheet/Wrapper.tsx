/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';

import { Gap } from '@instana/components/types/components/Stack/types';
import { Stack } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';

export function ScopeWrapper({
  title,
  description,
  children,
  gap
}: {
  title: string;
  description: string;
  children: ReactNode;
  gap: keyof typeof Gap;
}) {
  return (
    <Stack direction="vertical" gap={gap}>
      <Stack direction="vertical" gap={'disabled'}>
        <AlertTypography variant="heading-200" content={title} />
        <AlertTypography variant="body-small" content={description} color="color600" />
      </Stack>
      {children}
    </Stack>
  );
}

export function SectionWrapper({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>;
}
