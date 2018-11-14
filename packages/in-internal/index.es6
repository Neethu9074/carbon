import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import SelfServiceQualityOfServiceStats from 'in-internal/SelfServiceQualityOfServiceStats/SelfServiceQualityOfServiceStats';
import FillerSpanProcessingStats from 'in-internal/FillerSpanProcessingStats/FillerSpanProcessingStats';
import TracesSubscriptionStats from 'in-internal/TracesSubscriptionStats/TracesSubscriptionStats';
import QualityOfServiceStats from 'in-internal/QualityOfServiceStats/QualityOfServiceStats';
import AppDataProcessorStatistics from 'in-internal/AppDataProcessorStatistics';
import AppDataQueryPerformance from 'in-internal/AppDataQueryPerformance';
import AppDataWriterForEum from 'in-internal/eum/AppDataWriter';
import EumProcessor from 'in-internal/eum/EumProcessor';
import EumAcceptor from 'in-internal/eum/EumAcceptor';
import TuStatistics from 'in-internal/TuStatistics';
import DevDashboard from 'in-internal/DevDashboard';
import EumOverview from 'in-internal/eum/Overview';
import FillerStats from 'in-internal/FillerStats';
import Appdata from 'in-internal/Appdata/Appdata';

export default function Internal() {
  return (
    <Switch>
      <Route path="/internal/devDashboard" component={DevDashboard} />
      <Route path="/internal/tuStatistics" component={TuStatistics} />
      <Route path="/internal/eum/eum-acceptor" component={EumAcceptor} />
      <Route path="/internal/eum/eum-processor" component={EumProcessor} />
      <Route path="/internal/eum/appdata-writer" component={AppDataWriterForEum} />
      <Route path="/internal/eum" component={EumOverview} />
      <Route path="/internal/fillerStats" component={FillerStats} />
      <Route path="/internal/appdata" component={Appdata} />
      <Route path="/internal/appdataProcessing" component={AppDataProcessorStatistics} />
      <Route path="/internal/fillerSpanProcessingStats" component={FillerSpanProcessingStats} />
      <Route path="/internal/qualityOfServiceStats" component={QualityOfServiceStats} />
      <Route path="/internal/selfServiceQualityOfServiceStats" component={SelfServiceQualityOfServiceStats} />
      <Route path="/internal/appDataQueryPerformance" component={AppDataQueryPerformance} />
      <Route path="/internal/tracesSubscriptionStats" component={TracesSubscriptionStats} />
      <Redirect from="/internal" to="/internal/devDashboard" />
    </Switch>
  );
}
