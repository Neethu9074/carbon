/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Message, SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';

import locals from 'in-alerting/smart-alerts/components/dialog/TwoColumnContainer.mless';

interface TwoColumnContainerProps {
  mainContent: ReactNode;
  mainContentHeadline: string;
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
  mainContentHeadline,
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
          <h3 className={locals.headline}>{mainContentHeadline}</h3>
          {infoContent && (
            <Tooltip align="topMiddle" content={infoContent}>
              <SvgIcon type="lib_help_error_info_outline" color={theme.lib.colors.N600Light} />
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

TwoColumnContainer.propTypes = {
  mainContent: PropTypes.node.isRequired,
  mainContentHeadline: PropTypes.string.isRequired,
  moveMainAreaRight: PropTypes.bool,
  removePaddingSecondaryArea: PropTypes.bool,
  secondaryContent: PropTypes.node.isRequired,
  warnMessage: PropTypes.node,
  removeMainAreaContentBorder: PropTypes.bool
};
