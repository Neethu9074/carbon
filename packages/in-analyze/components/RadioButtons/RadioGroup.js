/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import classNames from 'classnames';

import { entityTypes } from 'in-analyze/applicationFilter';
import Message from 'in-new-components/Message';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './RadioGroup.mless';

const RadioGroup = ({ disabled, onChange, value, sourceEntityAvailability }) => {
  if (!sourceEntityAvailability) {
    return <Message small title={t('in-analyze:radioButtons.messageFilering')} />;
  } else if (disabled && value !== entityTypes.SOURCE) {
    return <Message small title={t('in-analyze:radioButtons.messageIndependent')} />;
  }
  return (
    <Fragment>
      <span className={locals.textLabel}>
        {disabled && value === entityTypes.SOURCE
          ? t('in-analyze:radioButtons.fragmentSource')
          : t('in-analyze:radioButtons.fragmentCall')}
      </span>
      <div className={locals.inputGroup}>
        <label
          className={classNames({
            [locals.radioInput]: true,
            [locals.radioInputChecked]: value === entityTypes.SOURCE,
            [locals.radioInputDisabled]: disabled
          })}
        >
          <input
            type="radio"
            name="sourceInput"
            value={entityTypes.SOURCE}
            checked={value === entityTypes.SOURCE}
            onChange={onChange}
          />
          <SvgIcon className={locals.icon} type="lib_application_call_source" />
          <span className={locals.label}>{t('in-analyze:components.radioButtons.source')}</span>
        </label>

        <label
          className={classNames({
            [locals.radioInput]: true,
            [locals.radioInputChecked]: value === entityTypes.DESTINATION,
            [locals.radioInputDisabled]: disabled
          })}
        >
          <input
            type="radio"
            name="destinationInput"
            value={entityTypes.DESTINATION}
            checked={value === entityTypes.DESTINATION}
            onChange={onChange}
          />
          <SvgIcon className={locals.icon} type="lib_application_call_destination" />
          <span className={locals.label}>{t('in-analyze:components.radioButtons.destination')}</span>
        </label>
      </div>
    </Fragment>
  );
};

export default RadioGroup;
