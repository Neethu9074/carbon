import { uniq } from 'lodash';
import React from 'react';

import locals from './ErroneousResultPresenter.mless';
import { isTechnicalError } from 'in-types/error';

// Usage
// <ErrorneousResultPresenter errors={[
//   {
//     message: 'Something went wrong',
//     code: 'SERVER'
//   }
// ]}/>

export default function ErrorneousResultPresenter({ errors }) {
  if (errors == null || errors.length === 0) {
    return null;
  }

  return (
    <ul className={locals.errors}>
      {uniq(errors.map(getMessage)).map((error, i) => (
        <li key={i} className={locals.error}>
          {error}
        </li>
      ))}
    </ul>
  );
}

function getMessage(error) {
  if (isTechnicalError(error.code)) {
    return 'An unexpected error occurred. Please refrehs the page or try again later.';
  }
  return error.message;
}
