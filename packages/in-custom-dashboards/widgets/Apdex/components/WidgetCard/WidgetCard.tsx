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
  rightHeaderContent?: React.ReactElement;
  leftHeaderContent?: React.ReactElement;
  children: React.ReactNode;
  isInModal?: boolean;
}

export default function WidgetCard({
  children,
  progress,
  rightHeaderContent,
  isInModal,
  leftHeaderContent
}: WidgetCardProps) {
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
        rightHeaderContent={rightHeaderContent}
        leftHeaderContent={leftHeaderContent}
      >
        <div className={locals.cardBody}>{children}</div>
      </Card>
    </div>
  );
}
