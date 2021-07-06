/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Tr, Td } from '@instana/components';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

export default function EmptyContent({ cols, size, renderNoDataAvailable, noDataMessage }) {
  return (
    <Tr size={size}>
      <Td colSpan={cols}>
        {renderNoDataAvailable ? (
          renderNoDataAvailable(noDataMessage)
        ) : (
          <NoDataAvailable text={noDataMessage} height={80} />
        )}
      </Td>
    </Tr>
  );
}
