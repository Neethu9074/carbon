/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

export default function BuiltInIndicator({ builtIn }: { builtIn?: boolean }) {
  if (!builtIn) return null;

  return <Pill kind="lighter">{t('in-alerting:smartAlerts.details.titleBuiltInIndicator')}</Pill>;
}
