/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card } from '@instana/components';

import { SloWidgetPresenterProps } from 'in-custom-dashboards/widgets/Slo/SloWidgetPresenter';

export function SloWidget({ actions, title, dragHandle }: SloWidgetPresenterProps) {
  return (
    <Card
      rightHeaderContent={
        <>
          {dragHandle}
          {actions}
        </>
      }
      leftHeaderContent={<>{title}</>}
    >
      <div style={{ backgroundColor: 'magenta', width: '100%', height: '100%', minHeight: 100, minWidth: 100 }} />
    </Card>
  );
}
