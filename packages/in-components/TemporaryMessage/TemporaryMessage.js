/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { SvgIcon, Spacer } from '@instana/components';

import TemporaryPresenter from 'in-components/TemporaryPresenter';

import locals from './TemporaryMessage.mless';

export default function TemporaryMessage({ type = 'success', duration = 5000, id, onHide, message }) {
  return (
    <TemporaryPresenter duration={duration} id={id || message} onHide={onHide}>
      <Fragment>
        <Spacer vertical="normal" />
        <div className={locals.temporyMessageWrapper}>
          <SvgIcon
            className={classNames({
              [locals.notificationIconSuccess]: type === 'success',
              [locals.notificationIconError]: type === 'error'
            })}
            type={type === 'success' ? 'lib_check' : 'lib_help_error_warning'}
          />
          <span
            className={classNames({
              [locals.notificationLabelSuccess]: type === 'success',
              [locals.notificationLabelError]: type === 'error'
            })}
          >
            {message}
          </span>
        </div>
      </Fragment>
    </TemporaryPresenter>
  );
}
