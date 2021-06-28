/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import { uniq } from 'lodash';
import React from 'react';

import { Message } from '@instana/components';

import { isTechnicalError } from 'in-services/util/error';
import { emptyArray } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './ErroneousResultPresenter.mless';

// Usage
// <ErrorneousResultPresenter errors={[
//   {
//     message: 'Something went wrong',
//     code: 'SERVER'
//   }
// ]}/>

export default function ErrorneousResultPresenter({ errors, className, addBottomMargin = false }) {
  if (errors == null || errors.length === 0) {
    return null;
  }

  return (
    <ul
      className={classNames({
        [locals.errors]: true,
        [locals.bottomMargin]: addBottomMargin,
        [className]: className
      })}
    >
      {getUniqueErrors(errors).map((error, i) => (
        <li key={i} className={locals.item}>
          <Message type="error" small>
            {error}
          </Message>
        </li>
      ))}
    </ul>
  );
}

export function getUniqueErrors(errors = emptyArray) {
  return uniq(errors.map(getMessage));
}

function getMessage(error) {
  if (isTechnicalError(error.code) && !__DEV__) {
    return t('in-components:error.erroneousResultPresenterMessage');
  }
  return error.message;
}
