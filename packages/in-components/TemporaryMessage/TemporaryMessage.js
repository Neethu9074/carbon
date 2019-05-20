import React, { Fragment } from 'react';

import TemporaryPresenter from 'in-components/TemporaryPresenter';
import { evaluateClassNames } from 'in-services/util/classnames';
import Spacer from 'in-applications/Forms/components/Spacer';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TemporaryMessage.mless';

export default function TemporaryMessage({ type = 'success', duration = 5000, message }) {
  return (
    <TemporaryPresenter duration={duration}>
      <Fragment>
        <Spacer type="light" />
        <div className={locals.temporyMessageWrapper}>
          <SvgIcon
            className={evaluateClassNames({
              [locals.notificationIconSuccess]: type === 'success',
              [locals.notificationIconError]: type === 'error'
            })}
            type={type === 'success' ? 'lib_check' : 'lib_help_error_warning'}
            width={24}
            height={24}
          />
          <span
            className={evaluateClassNames({
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
