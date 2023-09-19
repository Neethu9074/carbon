/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';

export default function NoItemSelected({
  height = 80, // default height of an empty row with icon
  text
}: {
  height?: number;
  text?: string;
}) {
  return <NoDataAvailable text={text} height={height} type={'lib_help_error_warning_outline'} />;
}
