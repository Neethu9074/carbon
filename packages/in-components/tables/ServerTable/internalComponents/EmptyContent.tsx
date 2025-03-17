/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonTable, CarbonTableRow, CarbonTableCell } from '@instana/components';
import { TrSizes } from '@instana/legacy/types/components/Table/types';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

import locals from './EmptyContent.mless';

interface EmptyContentProps {
  cols?: number;
  size?: keyof typeof TrSizes;
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  noDataMessage?: string;
}

export default function EmptyContent({ cols, size, renderNoDataAvailable, noDataMessage }: EmptyContentProps) {
  return (
    <CarbonTable size={size === 'compact' ? 'lg' : 'xl'} className={locals.tableBorder}>
      <CarbonTableRow>
        <CarbonTableCell colSpan={cols}>
          {renderNoDataAvailable ? (
            renderNoDataAvailable(noDataMessage)
          ) : (
            <NoDataAvailable text={noDataMessage} height={80} />
          )}
        </CarbonTableCell>
      </CarbonTableRow>
    </CarbonTable>
  );
}
