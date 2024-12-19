/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Card, CardProps } from '@instana/components';

import locals from './Widget.mless';

interface PropsConfig {
  iframe: string;
}
interface IFrameWidgetProps extends Pick<CardProps, 'title'> {
  actions?: React.ReactNode;
  config: PropsConfig;
  isInModal?: boolean;
  dragHandle?: React.ReactNode;
  isPreview?: boolean;
}

export default function IFrameWidget({ title, config, actions, isInModal, isPreview, dragHandle }: IFrameWidgetProps) {
  return (
    <Card
      title={title}
      useMaxAvailableHeight={!isPreview}
      className={classNames({
        [locals.modal]: isInModal
      })}
      headerClassName={classNames({
        [locals.modal]: isInModal
      })}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
      isScrollable
    >
      <div className={locals.wrapper}>
        <iframe src={config.iframe} width="100%" height="600" sandbox="allow-forms allow-scripts" />
      </div>
    </Card>
  );
}
