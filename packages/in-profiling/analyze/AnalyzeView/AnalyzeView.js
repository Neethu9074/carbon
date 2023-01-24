/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import React from 'react';

import ProfiledProcesses from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcesses';
import getProfiledProcessesAvailable from 'in-profiling/subscriptions/getProfiledProcessesAvailable';
import { analyzeDataSourceUrlParameter } from 'in-profiling/navigation/urlParameters';
import EmptyAnalyzeView from 'in-profiling/analyze/AnalyzeView/EmptyAnalyzeView';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { getTimeConfig } from 'in-stores/time/config';
import SetBodyColor from 'in-components/SetBodyColor';
import useUrlState from 'in-hooks/useUrlState';
import Footer from 'in-components/Footer';

const urlStateConfig = {
  bind: [analyzeDataSourceUrlParameter]
};

export default function AnalyzeView(props) {
  const { location } = useLocation();
  const [{ dataSource }, onChange] = useUrlState(urlStateConfig);

  return (
    <WithEmptyStateFallback
      center={false}
      getHasDataToRender={() => getHasDataToRender(getTimeConfig(location))}
      FallbackComponent={EmptyAnalyzeView}
      type="Profiles"
    >
      <ProfiledProcesses {...props} timeConfig={getTimeConfig(location)} dataSource={dataSource} onChange={onChange} />
      <SetBodyColor color="#fff" />
      <Footer />
    </WithEmptyStateFallback>
  );
}
// );
function getHasDataToRender({ timeConfig }) {
  return getProfiledProcessesAvailable({ timeConfig }).map(
    result => !result.data || (result.data && result.data.containsProfiledProcesses)
  );
}
