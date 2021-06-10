/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import BasicWrapper from 'in-components/Errors/BasicWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/NoChannelSelected.mless';

export default function NoChannelSelected({
  height = 80, // default height of an empty row with icon
  text = t('in-alerting:components.noChannelSelectedText')
}) {
  return (
    <BasicWrapper
      text={text}
      height={height}
      className={locals.boldText}
      renderIcon={size => <SvgIcon className={locals.icon} type={'lib_help_error_warning_outline'} size={size} />}
    />
  );
}
