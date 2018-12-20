import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import FillerSpanProcessingStats from 'in-internal/FillerSpanProcessingStats/FillerSpanProcessingStats';
import TracesSubscriptionStats from 'in-internal/TracesSubscriptionStats/TracesSubscriptionStats';
import AppDataProcessorStatistics from 'in-internal/AppDataProcessorStatistics';
import AppDataQueryPerformance from 'in-internal/AppDataQueryPerformance';
import SloViolations from 'in-internal/SloViolations/SloViolations';
import AppDataWriterForEum from 'in-internal/eum/AppDataWriter';
import EumProcessor from 'in-internal/eum/EumProcessor';
import EumAcceptor from 'in-internal/eum/EumAcceptor';
import TuStatistics from 'in-internal/TuStatistics';
import DevDashboard from 'in-internal/DevDashboard';
import EumOverview from 'in-internal/eum/Overview';
import FillerStats from 'in-internal/FillerStats';
import Appdata from 'in-internal/Appdata/Appdata';
import WorkerStats from 'in-internal/sre/WorkerStats';
import SelfserviceWorkerStats from 'in-internal/sre/SelfserviceWorkerStats';
import Cassandra from 'in-internal/sre/Cassandra';
import Elastic from 'in-internal/sre/Elastic';
import Clickhouse from 'in-internal/sre/Clickhouse';
import Acceptors from 'in-internal/sre/Acceptors';

export default function Internal() {
  return (
    <Switch>
      <Route path="/internal/devDashboard" component={DevDashboard} />
      <Route path="/internal/tuStatistics" component={TuStatistics} />
      <Route path="/internal/sloViolations" component={SloViolations} />
      <Route path="/internal/eum/eum-acceptor" component={EumAcceptor} />
      <Route path="/internal/eum/eum-processor" component={EumProcessor} />
      <Route path="/internal/eum/appdata-writer" component={AppDataWriterForEum} />
      <Route path="/internal/eum" component={EumOverview} />
      <Route path="/internal/fillerStats" component={FillerStats} />
      <Route path="/internal/appdata" component={Appdata} />
      <Route path="/internal/appdataProcessing" component={AppDataProcessorStatistics} />
      <Route path="/internal/fillerSpanProcessingStats" component={FillerSpanProcessingStats} />
      <Route path="/internal/appDataQueryPerformance" component={AppDataQueryPerformance} />
      <Route path="/internal/tracesSubscriptionStats" component={TracesSubscriptionStats} />
      <Route path="/internal/sre/workerStats" component={WorkerStats} />
      <Route path="/internal/sre/selfserviceWorkerStats" component={SelfserviceWorkerStats} />
      <Route path="/internal/sre/cassandra" component={Cassandra} />
      <Route path="/internal/sre/acceptors" component={Acceptors} />
      <Route path="/internal/sre/elastic" component={Elastic} />
      <Route path="/internal/sre/clickhouse" component={Clickhouse} />
      <Redirect from="/internal" to="/internal/devDashboard" />
    </Switch>
  );
}
