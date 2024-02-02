/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
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
  isInModal?: boolean;
}

export default function WidgetCard({ children, progress, dragHandle, actions, isInModal, header }: WidgetCardProps) {
  return (
    <div className={locals.widgetCardWrapper}>
      {progress.loading && (
        <div className={locals.loadingIndicator}>
          <HorizontalIndicator progress={progress} />
        </div>
      )}
      <Card
        className={classNames({
          [locals.modal]: isInModal
        })}
        bodyClassName={classNames({
          [locals.modal]: isInModal
        })}
        headerClassName={classNames({
          [locals.noPaddingTitle]: isInModal
        })}
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
