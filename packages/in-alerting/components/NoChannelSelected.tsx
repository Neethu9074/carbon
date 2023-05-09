/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import NoItemSelected from 'in-alerting/smart-alerts/components/NoItemSelected';
import { t } from 'in-i18n';

export default function NoChannelSelected({
  height = 80, // default height of an empty row with icon
  text = t('in-alerting:components.noChannelSelectedText')
}: {
  height?: number;
  text?: string;
}) {
  return <NoItemSelected text={text} height={height} />;
}
