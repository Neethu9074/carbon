/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProfiledProcessesTable from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcessesTable';
import getProfiledProcesses from 'in-profiling/subscriptions/getProfiledProcesses';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import useCursorPagination from 'in-hooks/useCursorPagination';
import SearchBar from 'in-components/SearchBar';
import { query$ } from 'in-stores/search/query';
import Sticky from 'in-components/Sticky';

export default function ProfiledProcessesPresenter(props) {
  const pagination = useCursorPagination(
    ({ cursor }) =>
      query$.debounce(1000).flatMap(query =>
        getProfiledProcesses({
          pagination: {
            cursor,
            retrievalSize: 20
          },
          query,
          timeConfig: props.timeConfig
        })
      ),
    [props.query, props.timeConfig]
  );
  return (
    <>
      <Sticky header={<AnalyzeHeader renderQuickFilterBar={() => <SearchBar theme="light" showFilters={false} />} />}>
        <LeftRightPadding>
          <ProfiledProcessesTable {...{ ...props, ...pagination }} />
        </LeftRightPadding>
      </Sticky>
    </>
  );
}
