import { uniq } from 'lodash';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { isTechnicalError } from 'in-types/error';

import locals from './ErroneousResultPresenter.mless';

// Usage
// <ErrorneousResultPresenter errors={[
//   {
//     message: 'Something went wrong',
//     code: 'SERVER'
//   }
// ]}/>

export default function ErrorneousResultPresenter({ errors, className }) {
  if (errors == null || errors.length === 0) {
    return null;
  }

  return (
    <ul className={joinClassNames(locals.errors, className)}>
      {getUniqueErrors(errors).map((error, i) => (
        <li key={i} className={locals.error}>
          {error}
        </li>
      ))}
    </ul>
  );
}

function getUniqueErrors(errors = []) {
  return uniq(errors.map(getMessage));
}

function getMessage(error) {
  if (isTechnicalError(error.code) && !__DEV__) {
    return 'An unexpected error occurred. Please refresh the page or try again later.';
  }
  return error.message;
}
