/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import { uniq } from 'lodash';
import React from 'react';

import { Message, MessageTypes } from '@instana/components';

import { isTechnicalError } from 'in-services/util/error';
import { Error } from 'in-types';
import { t } from 'in-i18n';

import locals from './ErroneousResultPresenter.mless';

export interface Props {
  errors?: Error[];
  className?: string;
  addBottomMargin?: boolean;
  isRetryError?: boolean;
}

export default function ErroneousResultPresenter({
  errors,
  className,
  addBottomMargin = false,
  isRetryError = false
}: Props) {
  if (errors == null || errors.length === 0) {
    return null;
  }

  let messageType: MessageTypes = MessageTypes.error;
  if (isRetryError) {
    messageType = MessageTypes.warning;
  }

  return (
    <ul
      className={classNames(className, {
        [locals.errors]: true,
        [locals.bottomMargin]: addBottomMargin
      })}
    >
      {getUniqueErrors(errors).map((error, i) => (
        <li key={i} className={locals.item}>
          <Message type={messageType} small>
            {error}
          </Message>
        </li>
      ))}
    </ul>
  );
}

export function getUniqueErrors(errors: Error[] = []) {
  return uniq(errors.map(getMessage));
}

function getMessage(error: Error) {
  if (isTechnicalError(error.code) && !__DEV__) {
    return t('in-components:error.erroneousResultPresenterMessage');
  }
  return error.message;
}
