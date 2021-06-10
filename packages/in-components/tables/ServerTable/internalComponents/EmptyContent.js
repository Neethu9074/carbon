/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { Tr, Td } from 'in-components/tables/sharedComponents';

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
