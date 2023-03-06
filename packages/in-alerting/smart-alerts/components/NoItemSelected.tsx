/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import BasicWrapper from 'in-components/Errors/BasicWrapper';

import locals from 'in-alerting/smart-alerts/components/NoItemSelected.mless';

export default function NoItemSelected({
  height = 80, // default height of an empty row with icon
  text
}: {
  height: number;
  text: string;
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
