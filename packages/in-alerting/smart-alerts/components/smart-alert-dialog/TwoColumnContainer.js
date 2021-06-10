/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { warning } from 'in-components/Message/types';
import Message from 'in-components/Message';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/TwoColumnContainer.mless';

export default function TwoColumnContainer({
  mainContent,
  secondaryContent,
  mainContentHeadline,
  moveMainAreaRight,
  removePaddingSecondaryArea,
  warnMessage,
  removeMainAreaContentBorder
}) {
  return (
    <div
      className={classNames({
        [locals.container]: true,
        [locals.mainAreaLeft]: moveMainAreaRight
      })}
    >
      <div className={locals.mainArea}>
        <h3 className={locals.headline}>{mainContentHeadline}</h3>
        {warnMessage && <Message type={warning}>{warnMessage}</Message>}
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
