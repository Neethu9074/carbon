/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Stack } from '@instana/components';

import { t } from 'in-i18n';

import locals from './LogStackTrace.mless';

interface LogStackTraceProps {
  stackTrace: string;
}

export default function LogStackTrace({ stackTrace }: LogStackTraceProps) {
  return (
    <Stack direction="vertical" gap="xsmall">
      <span className={locals.title}>{t('in-logging:stackTrace')}:</span>
      <span className={locals.stackTrace}>{stackTrace}</span>
    </Stack>
  );
}
