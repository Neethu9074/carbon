/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message } from '@instana/components';
import { Ul, Li } from '@instana/components';

import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';

import locals from './ErrorList.mless';

export default function ErrorList({ className, errors }) {
  errors = getUniqueErrors(errors);
  return (
    <Ul className={className}>
      {errors.map(error => (
        <Li key={error}>
          <Message className={locals.message} type="error" small>
            {error}
          </Message>
        </Li>
      ))}
    </Ul>
  );
}
