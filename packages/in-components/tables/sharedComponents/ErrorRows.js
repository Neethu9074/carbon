/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message } from '@instana/components';

import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';
import { Tr, Td } from 'in-components/tables/sharedComponents/Table';

export default function ErrorRows({ cols, size, errors }) {
  return getUniqueErrors(errors).map(error => (
    <Tr key={error} size={size}>
      <Td colSpan={cols}>
        <Message type="error" small>
          {error}
        </Message>
      </Td>
    </Tr>
  ));
}
