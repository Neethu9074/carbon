/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TrSizes } from '@instana/legacy/types/components/Table/types';
import { Tr, Td } from '@instana/legacy';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

interface EmptyContentProps {
  cols?: number;
  size?: keyof typeof TrSizes;
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  noDataMessage?: string;
}

export default function EmptyContent({ cols, size, renderNoDataAvailable, noDataMessage }: EmptyContentProps) {
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
