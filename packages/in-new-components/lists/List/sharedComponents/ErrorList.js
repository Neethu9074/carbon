/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import { error as errorType } from 'in-new-components/Message/types';
import { Ul, Li } from 'in-new-components/lists/List';
import Message from 'in-new-components/Message';

import locals from './ErrorList.mless';

export default function ErrorList({ className, errors }) {
  errors = getUniqueErrors(errors);
  return (
    <Ul className={className}>
      {errors.map(error => (
        <Li key={error}>
          <Message className={locals.message} type={errorType} small>
            {error}
          </Message>
        </Li>
      ))}
    </Ul>
  );
}
