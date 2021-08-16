/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Ul, Li, Message } from '@instana/components';

import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';
import { Error } from 'in-types';

// @ts-ignore
import locals from './ErrorList.mless';

interface ErrorListProps {
  className?: string;
  errors: Error[];
}

export default function ErrorList({ className, errors }: ErrorListProps) {
  const errorStrings: string[] = getUniqueErrors(errors);

  return (
    <Ul className={className}>
      {errorStrings.map(error => (
        <Li key={error}>
          <Message className={locals.message} type="error" small>
            {error}
          </Message>
        </Li>
      ))}
    </Ul>
  );
}
