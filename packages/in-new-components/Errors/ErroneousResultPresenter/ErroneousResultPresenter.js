import { uniq } from 'lodash';
import React from 'react';

import { error as errorType } from 'in-new-components/Message/types';
import { evaluateClassNames } from 'in-services/util/classnames';
import { isTechnicalError } from 'in-services/util/error';
import { emptyArray } from 'in-services/fixedObjects';
import Message from 'in-new-components/Message';

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
      className={evaluateClassNames({
        [locals.errors]: true,
        [locals.bottomMargin]: addBottomMargin,
        [className]: className
      })}
    >
      {getUniqueErrors(errors).map((error, i) => (
        <li key={i} className={locals.item}>
          <Message type={errorType} small>
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
    return 'An unexpected error occurred. Please refresh the page or try again later.';
  }
  return error.message;
}
