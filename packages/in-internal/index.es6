import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';

import FillerSpanProcessingStats from 'in-internal/FillerSpanProcessingStats/FillerSpanProcessingStats';
import TracesSubscriptionStats from 'in-internal/TracesSubscriptionStats/TracesSubscriptionStats';
import AppDataProcessorStatistics from 'in-internal/Appdata/AppDataProcessorStatistics';
import AppDataQueryPerformance from 'in-internal/Appdata/AppDataQueryPerformance';
import SnapshotVersions from 'in-internal/SnapshotVersions/SnapshotVersions';
import SelfserviceWorkerStats from 'in-internal/sre/SelfserviceWorkerStats';
import GraphExplorer from 'in-internal/GraphExplorer/GraphExplorer';
import SloViolations from 'in-internal/SloViolations/SloViolations';
import ResilientMapping from 'in-internal/Appdata/ResilientMapping';
import InternalViewWrapper from 'in-internal/InternalViewWrapper';
import CallExtraction from 'in-internal/Appdata/CallExtraction';
import AppDataWriterForEum from 'in-internal/eum/AppDataWriter';
import EumProcessor from 'in-internal/eum/EumProcessor';
import WorkerStats from 'in-internal/sre/WorkerStats';
import EumAcceptor from 'in-internal/eum/EumAcceptor';
import TuStatistics from 'in-internal/TuStatistics';
import Clickhouse from 'in-internal/sre/Clickhouse';
import DevDashboard from 'in-internal/DevDashboard';
import EumOverview from 'in-internal/eum/Overview';
import FillerStats from 'in-internal/FillerStats';
import Appdata from 'in-internal/Appdata/Appdata';
import Cassandra from 'in-internal/sre/Cassandra';
import Acceptors from 'in-internal/sre/Acceptors';
import Elastic from 'in-internal/sre/Elastic';

export default function Internal() {
  return (
    <Switch>
      <Route path="/internal/graphExplorer" component={wrapIninternalView(GraphExplorer)} />
      <Route path="/internal/snapshotVersions" component={wrapIninternalView(SnapshotVersions)} />
      <Route path="/internal/tuStatistics" component={wrapIninternalView(TuStatistics)} />
      <Route path="/internal/sloViolations" component={wrapIninternalView(SloViolations)} />
      <Route path="/internal/eum/eum-acceptor" component={wrapIninternalView(EumAcceptor)} />
      <Route path="/internal/eum/eum-processor" component={wrapIninternalView(EumProcessor)} />
      <Route path="/internal/eum/appdata-writer" component={wrapIninternalView(AppDataWriterForEum)} />
      <Route path="/internal/eum" component={wrapIninternalView(EumOverview)} />
      <Route path="/internal/fillerStats" component={wrapIninternalView(FillerStats)} />
      <Route path="/internal/appdata" component={wrapIninternalView(Appdata)} />
      <Route path="/internal/appdataProcessing" component={wrapIninternalView(AppDataProcessorStatistics)} />
      <Route path="/internal/callExtraction" component={wrapIninternalView(CallExtraction)} />
      <Route path="/internal/fillerSpanProcessingStats" component={wrapIninternalView(FillerSpanProcessingStats)} />
      <Route path="/internal/appDataQueryPerformance" component={wrapIninternalView(AppDataQueryPerformance)} />
      <Route path="/internal/resilientMapping" component={wrapIninternalView(ResilientMapping)} />
      <Route path="/internal/tracesSubscriptionStats" component={wrapIninternalView(TracesSubscriptionStats)} />
      <Route path="/internal/sre/workerStats" component={wrapIninternalView(WorkerStats)} />
      <Route path="/internal/sre/selfserviceWorkerStats" component={wrapIninternalView(SelfserviceWorkerStats)} />
      <Route path="/internal/sre/cassandra" component={wrapIninternalView(Cassandra)} />
      <Route path="/internal/sre/acceptors" component={wrapIninternalView(Acceptors)} />
      <Route path="/internal/sre/elastic" component={wrapIninternalView(Elastic)} />
      <Route path="/internal/sre/clickhouse" component={wrapIninternalView(Clickhouse)} />

      <Route path="/internal/devDashboard" component={wrapIninternalView(DevDashboard)} />
      <Redirect from="/internal" to="/internal/devDashboard" />
    </Switch>
  );
}

const wrapIninternalView = Component => ininternalView.bind(null, Component);
function ininternalView(Component, props) {
  return (
    <InternalViewWrapper>
      <Component {...props} />
    </InternalViewWrapper>
  );
}
