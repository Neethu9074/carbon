/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from 'in-synthetics/dashboards/details/components/KeyValueHeader.mless';

type KeyValueHeaderProps = {
  label?: string | number | React.ReactElement;
  value: string | number | React.ReactElement;
  content?: string | number | React.ReactElement;
};

export default function KeyValueHeader({ label, value, content }: KeyValueHeaderProps) {
  return (
    <Tooltip content={content} align="leftMiddle">
      <div className={locals.subHeader}>
        <span className={locals.key}>{label}</span>
        <span className={locals.value}>{value}</span>
      </div>
    </Tooltip>
  );
}
