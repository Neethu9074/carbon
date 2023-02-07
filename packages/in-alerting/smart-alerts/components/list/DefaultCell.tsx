/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import locals from 'in-alerting/smart-alerts/components/list/DefaultCell.mless';

interface DefaultType {
  title: string;
  subtitle?: string;
}

export default function DefaultCell({ title, subtitle }: DefaultType) {
  return (
    <div className={locals.column}>
      <div className={locals.name}>{title}</div>
      {subtitle && <div className={locals.nameSubtext}>{subtitle}</div>}
    </div>
  );
}
