/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Card, HorizontalIndicator } from '@instana/components';
import { Progress } from '@instana/types';

import locals from './SloWidgetCard.mless';

interface WidgetCardProps {
  children: React.ReactNode;
  isInModal?: boolean;
  leftHeaderContent?: React.ReactElement;
  progress: Progress;
  rightHeaderContent?: React.ReactElement;
}

export default function SloWidgetCard({
  children,
  isInModal,
  leftHeaderContent,
  progress,
  rightHeaderContent
}: WidgetCardProps) {
  return (
    <div className={locals.cardWrapper}>
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
        <div
          className={classNames(locals.contentWrapper, {
            [locals.noPadding]: isInModal
          })}
        >
          {children}
        </div>
      </Card>
    </div>
  );
}
