/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

import locals from './EmptyContent.mless';

interface EmptyContentProps {
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  noDataMessage?: string;
}

export default function EmptyContent({ renderNoDataAvailable, noDataMessage }: EmptyContentProps) {
  return (
    <div className={locals.tableBorder}>
      {renderNoDataAvailable ? (
        renderNoDataAvailable(noDataMessage)
      ) : (
        <NoDataAvailable text={noDataMessage} height={80} />
      )}
    </div>
  );
}
