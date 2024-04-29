/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Message, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/components/tearSheet/TwoColumnContainer.mless';

interface TwoColumnContainerProps {
  mainContent: ReactNode;
  moveMainAreaRight?: boolean;
  removePaddingSecondaryArea?: boolean;
  secondaryContent: ReactNode;
  warnMessage?: ReactNode;
  infoContent?: ReactNode;
  removeMainAreaContentBorder?: boolean;
}

export default function TwoColumnContainer({
  mainContent,
  secondaryContent,
  moveMainAreaRight,
  removePaddingSecondaryArea,
  warnMessage,
  infoContent,
  removeMainAreaContentBorder
}: TwoColumnContainerProps) {
  return (
    <div
      className={classNames({
        [locals.container]: true,
        [locals.mainAreaLeft]: moveMainAreaRight
      })}
    >
      <div className={locals.mainArea}>
        {/* Note:  some css has been applied for 2nd child here using :nth-child  inside columnHeader class*/}
        <div className={locals.columnHeader}>
          {infoContent && (
            <Tooltip align="topMiddle" content={infoContent}>
              <SvgIcon type="lib_help_error_info_outline" color={themes.default.ids.color.option.neutral['600']} />
            </Tooltip>
          )}
        </div>
        {warnMessage && <Message type="warning">{warnMessage}</Message>}
        <div
          className={classNames({
            [locals.mainAreaContent]: true,
            [locals.removeMainAreaContentBorder]: removeMainAreaContentBorder
          })}
        >
          {mainContent}
        </div>
      </div>
      <div
        className={classNames({
          [locals.secondaryArea]: true,
          [locals.removePadding]: removePaddingSecondaryArea,
          [locals.borderRight]: moveMainAreaRight
        })}
      >
        {secondaryContent}
      </div>
    </div>
  );
}
