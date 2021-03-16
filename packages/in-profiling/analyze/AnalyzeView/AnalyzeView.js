/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withProps } from 'recompose';
import React from 'react';

import ProfiledProcesses from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/ProfiledProcesses';
import getProfiledProcessesAvailable from 'in-profiling/subscriptions/getProfiledProcessesAvailable';
import { analyzeDataSourceUrlParameter } from 'in-profiling/navigation/urlParameters';
import EmptyAnalyzeView from 'in-profiling/analyze/AnalyzeView/EmptyAnalyzeView';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { getTimeConfig } from 'in-stores/time/config';
import SetBodyColor from 'in-components/SetBodyColor';
import withUrlState from 'in-hoc/withUrlState';
import Footer from 'in-new-components/Footer';

export default compose(
  withUrlState({
    bind: [analyzeDataSourceUrlParameter],
    reducerName: 'onChange'
  }),
  withProps(({ location }) => ({
    timeConfig: getTimeConfig(location)
  }))
)(props => (
  <WithEmptyStateFallback
    center={false}
    getHasDataToRender={() => getHasDataToRender(props)}
    FallbackComponent={EmptyAnalyzeView}
    type="Profiles"
  >
    <ProfiledProcesses {...props} />
    <SetBodyColor color="#fff" />
    <Footer />
  </WithEmptyStateFallback>
));

function getHasDataToRender({ timeConfig }) {
  return getProfiledProcessesAvailable({ timeConfig }).map(
    result => !result.data || (result.data && result.data.containsProfiledProcesses)
  );
}
