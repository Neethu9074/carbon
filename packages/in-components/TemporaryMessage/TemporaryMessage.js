import React, { Fragment } from 'react';
import classNames from 'classnames';

import TemporaryPresenter from 'in-components/TemporaryPresenter';
import Spacer from 'in-applications/Forms/components/Spacer';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TemporaryMessage.mless';

export default function TemporaryMessage({ type = 'success', duration = 5000, id, onHide, message }) {
  return (
    <TemporaryPresenter duration={duration} id={id || message} onHide={onHide}>
      <Fragment>
        <Spacer type="light" />
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
