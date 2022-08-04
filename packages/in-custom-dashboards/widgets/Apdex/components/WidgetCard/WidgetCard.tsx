/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card, HorizontalIndicator } from '@instana/components';
import { Progress } from '@instana/types';

import locals from './WidgetCard.mless';

interface WidgetCardProps {
  progress: Progress;
  dragHandle: React.ReactNode;
  actions: React.ReactNode;
  header: React.ReactElement;
  children: React.ReactNode;
}

export default function WidgetCard({ children, progress, dragHandle, actions, header }: WidgetCardProps) {
  return (
    <div className={locals.widgetCardWrapper}>
      {progress.loading && (
        <div className={locals.loadingIndicator}>
          <HorizontalIndicator progress={progress} />
        </div>
      )}
      <Card
        rightHeaderContent={
          <>
            {dragHandle}
            {actions}
          </>
        }
        leftHeaderContent={header}
      >
        <div className={locals.cardBody}>{children}</div>
      </Card>
    </div>
  );
}
