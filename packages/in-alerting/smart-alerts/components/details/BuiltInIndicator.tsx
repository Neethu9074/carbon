/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Pill } from '@instana/components';

import { t } from 'in-i18n';

export default function BuiltInIndicator({ builtIn }: { builtIn?: boolean }) {
  if (!builtIn) return null;

  return <Pill type="gray">{t('in-alerting:smartAlerts.details.titleBuiltInIndicator')}</Pill>;
}
