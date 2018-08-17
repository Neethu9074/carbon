import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import FillerSpanProcessingStats from 'in-internal/FillerSpanProcessingStats/FillerSpanProcessingStats';
import QualityOfServiceStats from 'in-internal/QualityOfServiceStats/QualityOfServiceStats';
import AppDataQueryPerformance from 'in-internal/AppDataQueryPerformance';
import TuStatistics from 'in-internal/TuStatistics';
import DevDashboard from 'in-internal/DevDashboard';
import FillerStats from 'in-internal/FillerStats';
import Appdata from 'in-internal/Appdata/Appdata';
import EumStats from 'in-internal/EumStats';

export default function Internal() {
  return (
    <Switch>
      <Route path="/internal/devDashboard" component={DevDashboard} />
      <Route path="/internal/tuStatistics" component={TuStatistics} />
      <Route path="/internal/eumStats" component={EumStats} />
      <Route path="/internal/fillerStats" component={FillerStats} />
      <Route path="/internal/appdata" component={Appdata} />
      <Route path="/internal/fillerSpanProcessingStats" component={FillerSpanProcessingStats} />
      <Route path="/internal/qualityOfServiceStats" component={QualityOfServiceStats} />
      <Route path="/internal/appDataQueryPerformance" component={AppDataQueryPerformance} />
      <Redirect from="/internal" to="/internal/devDashboard" />
    </Switch>
  );
}
