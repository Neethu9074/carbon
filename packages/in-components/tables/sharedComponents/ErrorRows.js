/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';
import { Tr, Td } from 'in-components/tables/sharedComponents/Table';
import { error as errorType } from 'in-components/Message/types';
import Message from 'in-components/Message';

export default function ErrorRows({ cols, size, errors }) {
  return getUniqueErrors(errors).map(error => (
    <Tr key={error} size={size}>
      <Td colSpan={cols}>
        <Message type={errorType} small>
          {error}
        </Message>
      </Td>
    </Tr>
  ));
}
