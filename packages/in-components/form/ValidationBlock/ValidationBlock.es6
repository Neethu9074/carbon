import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import './ValidationBlock.less';

const block = 'in-form-validation-block';

export default function ValidationBlock({ children, className }) {
  return <p className={joinClassNames(block, className)}>{children}</p>;
}

export function BackendValidationMessages({ validationResult }) {
  if (validationResult.valid) {
    return null;
  }

  return <ValidationBlock hasError>{`${validationResult.error}.`}</ValidationBlock>;
}
