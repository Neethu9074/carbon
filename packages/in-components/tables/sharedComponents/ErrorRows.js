/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import { error as errorType } from 'in-new-components/Message/types';
import { Tr, Td } from 'in-components/tables/sharedComponents/Table';
import Message from 'in-new-components/Message';

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
