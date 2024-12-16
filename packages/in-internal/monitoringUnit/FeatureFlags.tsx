/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

/* eslint-disable no-console */
import React, { Fragment, useState } from 'react';

import { DataTable as CarbonDataTable, Pagination as CarbonPagination, Toggle } from '@instana/components';

// @ts-expect-error not yet ts migrated:
// eslint-disable-next-line no-restricted-imports
import serverResolverFlags from 'in-server/src/services/resolvers/featureFlags';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { isFeatureFlagEnabled } from 'in-services/config';

export default function FeatureFlags() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(500);

  const carbonHeaders = [
    {
      key: 'name',
      header: 'Name'
    },
    {
      key: 'instanaCtlname',
      header: 'InstanaCtl name'
    },
    {
      key: 'defaultValue',
      header: 'Production default'
    },
    {
      key: 'currentValue',
      header: 'Current value'
    }
  ];

  const carbonRows = serverResolverFlags.map(
    (serverResolverFlagsDetails: {
      uiClientKey: string;
      instanaCtlKey: string;
      defaultValue: { toString: () => string };
    }) => {
      return {
        id: serverResolverFlagsDetails.uiClientKey,
        name: serverResolverFlagsDetails.uiClientKey,
        instanaCtlname: serverResolverFlagsDetails.instanaCtlKey,
        defaultValue: (
          <div>
            <Toggle checked={!!serverResolverFlagsDetails.defaultValue} />
            <span>{serverResolverFlagsDetails.defaultValue.toString()}</span>
          </div>
        ),
        currentValue: (
          <div>
            <Toggle checked={!!isFeatureFlagEnabled(serverResolverFlagsDetails.uiClientKey)} />
            <span>{isFeatureFlagEnabled(serverResolverFlagsDetails.uiClientKey) ? 'true' : 'false'}</span>
          </div>
        )
      };
    }
  );

  // Sort the rows by the 'name' field
  const sortedRows = carbonRows.sort((a: { name: string }, b: { name: string }) => {
    return a.name.localeCompare(b.name);
  });

  // Get the rows for the current page
  const getCurrentPageRows = () => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedRows.slice(startIndex, endIndex);
  };

  // Handle pagination state changes
  const changePaginationState = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <Fragment>
      <DashboardSection title="Current feature flags">
        This is reflecting the existing list shown in the browser. It is generated and filled by the server from values
        stored in the config database.
      </DashboardSection>
      <CarbonDataTable headers={carbonHeaders} rows={getCurrentPageRows()} />
      {sortedRows.length > 15 && (
        <CarbonPagination
          totalItems={sortedRows.length}
          pageSize={pageSize}
          pageSizes={[100, 500]}
          page={page}
          onChange={changePaginationState}
        />
      )}
    </Fragment>
  );
}
