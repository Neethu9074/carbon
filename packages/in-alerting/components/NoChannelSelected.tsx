/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { t } from 'in-i18n';

export default function NoChannelSelected({
  height = 80, // default height of an empty row with icon
  text = t('in-alerting:components.noChannelSelectedText')
}: {
  height?: number;
  text?: string;
}) {
  return <NoDataAvailable text={text} height={height} type={'lib_help_error_warning_outline'} />;
}
