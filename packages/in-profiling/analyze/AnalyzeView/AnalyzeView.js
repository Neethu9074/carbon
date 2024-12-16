/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProfiledProcesses from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcesses';
import getProfiledProcessesAvailable from 'in-profiling/subscriptions/getProfiledProcessesAvailable';
import { analyzeDataSourceUrlParameter } from 'in-profiling/navigation/urlParameters';
import EmptyAnalyzeView from 'in-profiling/analyze/AnalyzeView/EmptyAnalyzeView';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getTimeConfig } from 'in-stores/time/config';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-components/Footer';

const urlStateConfig = {
  bind: [analyzeDataSourceUrlParameter]
};

export default function AnalyzeView(props) {
  const location = useLocation();
  const [{ dataSource }, onChange] = useUrlState(urlStateConfig);

  return (
    <WithEmptyStateFallback
      center={false}
      getHasDataToRender={() =>
        getHasDataToRender({
          timeConfig: getTimeConfig(location)
        })
      }
      FallbackComponent={EmptyAnalyzeView}
      type="Profiles"
    >
      <ProfiledProcesses {...props} timeConfig={getTimeConfig(location)} dataSource={dataSource} onChange={onChange} />
      <Footer />
    </WithEmptyStateFallback>
  );
}
function getHasDataToRender({ timeConfig }) {
  return getProfiledProcessesAvailable({ timeConfig }).map(
    result => !result.data || (result.data && result.data.containsProfiledProcesses)
  );
}
