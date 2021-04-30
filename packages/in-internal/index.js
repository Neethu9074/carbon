/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Redirect } from 'react-router-dom';
import React from 'react';

// features for monitoring units
import AppDataLiveAggregatorOverview from 'in-internal/monitoringUnit/Appdata/AppDataLiveAggregatorOverview';
// features available on customer units
import SnapshotVersions from 'in-internal/thisUnit/SnapshotVersions/SnapshotVersions';
import AppDataProcessorStatistics from 'in-internal/monitoringUnit/Appdata/AppDataProcessorStatistics';
import FillerInfrastructureMetrics from 'in-internal/monitoringUnit/infrastructureMetrics/Filler';
import AppDataQueryPerformance from 'in-internal/monitoringUnit/Appdata/AppDataQueryPerformance';
import ClickhouseTotalTableSizes from 'in-internal/monitoringUnit/sre/ClickhouseTotalTableSizes';
// General imports
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import AppdataHealthProcessor from 'in-internal/monitoringUnit/Appdata/AppdataHealthProcessor';
import ServerlessAcceptors from 'in-internal/monitoringUnit/serverless/ServerlessAcceptors';
import JsStackTraceTranslator from 'in-internal/monitoringUnit/eum/JsStackTraceTranslator';
import BeeInstanaAggregators from 'in-internal/monitoringUnit/sre/BeeInstanaAggregators';
import BeeInstanaIngestors from 'in-internal/monitoringUnit/sre/BeeInstanaIngestors';
import EumHealthProcessor from 'in-internal/monitoringUnit/eum/EumHealthProcessor';
import SloViolations from 'in-internal/monitoringUnit/SloViolations/SloViolations';
import ResilientMapping from 'in-internal/monitoringUnit/Appdata/ResilientMapping';
import BatchingInsights from 'in-internal/monitoringUnit/Appdata/BatchingInsights';
import ProfilesCassandra from 'in-internal/monitoringUnit/sre/ProfilesCassandra';
import InternalEvents from 'in-internal/thisUnit/InternalEvents/InternalEvents';
import MetricsCassandra from 'in-internal/monitoringUnit/sre/MetricsCassandra';
import CallExtraction from 'in-internal/monitoringUnit/Appdata/CallExtraction';
import AppDataWriterForEum from 'in-internal/monitoringUnit/eum/AppDataWriter';
import GraphExplorer from 'in-internal/thisUnit/GraphExplorer/GraphExplorer';
import ErrorSimulator from 'in-internal/monitoringUnit/eum/ErrorSimulator';
import SpansCassandra from 'in-internal/monitoringUnit/sre/SpansCassandra';
import StateCassandra from 'in-internal/monitoringUnit/sre/StateCassandra';
import MetaElasticNG from 'in-internal/monitoringUnit/sre/MetaElasticNG';
import EumProcessor from 'in-internal/monitoringUnit/eum/EumProcessor';
import LogProcessor from 'in-internal/monitoringUnit/log/LogProcessor';
import EntityStatistics from 'in-internal/thisUnit/EntityStatistics';
import MetaElastic from 'in-internal/monitoringUnit/sre/MetaElastic';
import EumAcceptor from 'in-internal/monitoringUnit/eum/EumAcceptor';
import Hubforce from 'in-internal/monitoringUnit/hubforce/Hubforce';
import Clickhouse from 'in-internal/monitoringUnit/sre/Clickhouse';
import ClickhouseLogs from 'in-internal/monitoringUnit/sre/ClickhouseLogs';
import Cashiers from 'in-internal/monitoringUnit/cashier/Cashiers';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import EumOverview from 'in-internal/monitoringUnit/eum/Overview';
import AgentsAcrossUnits from 'in-internal/monitoringUnit/Agents';
import LogWriter from 'in-internal/monitoringUnit/log/LogWriter';
import LogReader from 'in-internal/monitoringUnit/log/LogReader';
import UnitList from 'in-internal/monitoringUnit/units/UnitList';
import FillerStats from 'in-internal/monitoringUnit/FillerStats';
import Appdata from 'in-internal/monitoringUnit/Appdata/Appdata';
import Acceptors from 'in-internal/monitoringUnit/sre/Acceptors';
import Switch from 'in-components/FragmentSupportingSwitch';
import Kafka from 'in-internal/monitoringUnit/sre/Kafka';
import Unit from 'in-internal/monitoringUnit/unit/Unit';
import Region from 'in-internal/monitoringUnit/Region';
import Landing from 'in-internal/components/Landing';
import Agents from 'in-internal/thisUnit/Agents';

export default function Internal() {
  return (
    <Switch>
      {internalMonitoringUnit && (
        <>
          <Route path="/internal/monitoringUnit/units" component={UnitList} />
          <Route path="/internal/monitoringUnit/unit" component={Unit} />
          <Route path="/internal/monitoringUnit/agents" component={AgentsAcrossUnits} />

          <Route path="/internal/monitoringUnit/region" component={wrapIninternalView(Region)} />
          <Route path="/internal/monitoringUnit/sloViolations" component={wrapIninternalView(SloViolations)} />
          <Route path="/internal/monitoringUnit/eum/eum-acceptor" component={wrapIninternalView(EumAcceptor)} />
          <Route path="/internal/monitoringUnit/eum/eum-processor" component={wrapIninternalView(EumProcessor)} />
          <Route
            path="/internal/monitoringUnit/eum/appdata-writer"
            component={wrapIninternalView(AppDataWriterForEum)}
          />
          <Route path="/internal/monitoringUnit/eum/errorSimulator" component={wrapIninternalView(ErrorSimulator)} />
          <Route
            path="/internal/monitoringUnit/eum/jsStackTraceTranslator"
            component={wrapIninternalView(JsStackTraceTranslator)}
          />
          <Route
            path="/internal/monitoringUnit/eum/eumHealthProcessor"
            component={wrapIninternalView(EumHealthProcessor)}
          />
          <Route path="/internal/monitoringUnit/eum" component={wrapIninternalView(EumOverview)} />
          <Route path="/internal/monitoringUnit/fillerStats" component={wrapIninternalView(FillerStats)} />
          <Route
            path="/internal/monitoringUnit/appdataBatchingInsights"
            component={wrapIninternalView(BatchingInsights)}
          />
          <Route path="/internal/monitoringUnit/appdata" component={wrapIninternalView(Appdata)} />
          <Route
            path="/internal/monitoringUnit/appdataLiveAggregator"
            component={wrapIninternalView(AppDataLiveAggregatorOverview)}
          />
          <Route path="/internal/monitoringUnit/appdata" component={wrapIninternalView(Appdata)} />
          <Route
            path="/internal/monitoringUnit/appdataHealthProcessor"
            component={wrapIninternalView(AppdataHealthProcessor)}
          />
          <Route
            path="/internal/monitoringUnit/appdataProcessing"
            component={wrapIninternalView(AppDataProcessorStatistics)}
          />
          <Route path="/internal/monitoringUnit/callExtraction" component={wrapIninternalView(CallExtraction)} />
          <Route
            path="/internal/monitoringUnit/appDataQueryPerformance"
            component={wrapIninternalView(AppDataQueryPerformance)}
          />
          <Route path="/internal/monitoringUnit/resilientMapping" component={wrapIninternalView(ResilientMapping)} />
          <Route path="/internal/monitoringUnit/sre/acceptors" component={wrapIninternalView(Acceptors)} />
          <Route
            path="/internal/monitoringUnit/sre/beeinstanaaggregators"
            component={wrapIninternalView(BeeInstanaAggregators)}
          />
          <Route
            path="/internal/monitoringUnit/sre/beeinstanaingestors"
            component={wrapIninternalView(BeeInstanaIngestors)}
          />
          <Route
            path="/internal/monitoringUnit/sre/metricscassandra"
            component={wrapIninternalView(MetricsCassandra)}
          />
          <Route path="/internal/monitoringUnit/sre/spanscassandra" component={wrapIninternalView(SpansCassandra)} />
          <Route
            path="/internal/monitoringUnit/sre/profilescassandra"
            component={wrapIninternalView(ProfilesCassandra)}
          />
          <Route path="/internal/monitoringUnit/sre/statecassandra" component={wrapIninternalView(StateCassandra)} />
          <Route path="/internal/monitoringUnit/sre/clickhouse" component={wrapIninternalView(Clickhouse)} />
          <Route path="/internal/monitoringUnit/sre/clickhouseLogs" component={wrapIninternalView(ClickhouseLogs)} />
          <Route
            path="/internal/monitoringUnit/sre/clickhouseTableSizes"
            component={wrapIninternalView(ClickhouseTotalTableSizes)}
          />
          <Route path="/internal/monitoringUnit/sre/elastic" component={wrapIninternalView(MetaElastic)} />
          <Route path="/internal/monitoringUnit/sre/elasticng" component={wrapIninternalView(MetaElasticNG)} />
          <Route path="/internal/monitoringUnit/sre/kafka" component={wrapIninternalView(Kafka)} />
          <Route
            path="/internal/monitoringUnit/serverless/serverlessacceptors"
            component={wrapIninternalView(ServerlessAcceptors)}
          />
          <Route path="/internal/monitoringUnit/cashier/cashiers" component={wrapIninternalView(Cashiers)} />
          <Route
            path="/internal/monitoringUnit/infrastructureMetrics/filler"
            component={wrapIninternalView(FillerInfrastructureMetrics)}
          />
          <Route path="/internal/monitoringUnit/hubforce" component={wrapIninternalView(Hubforce)} />
        </>
      )}

      <Route path="/internal/monitoringUnit/log/LogProcessor" component={wrapIninternalView(LogProcessor)} />
      <Route path="/internal/monitoringUnit/log/LogWriter" component={wrapIninternalView(LogWriter)} />
      <Route path="/internal/monitoringUnit/log/LogReader" component={wrapIninternalView(LogReader)} />

      <>
        <Route path="/internal/thisUnit/entityStatistics" component={EntityStatistics} />
        <Route path="/internal/thisUnit/graphExplorer" component={wrapIninternalView(GraphExplorer)} />
        <Route path="/internal/thisUnit/snapshotVersions" component={wrapIninternalView(SnapshotVersions)} />
        <Route path="/internal/thisUnit/internalEvents" component={wrapIninternalView(InternalEvents)} />
        <Route path="/internal/thisUnit/agents" component={Agents} />
      </>

      <Route path="/internal" component={wrapIninternalView(Landing)} />
      <Redirect to="/internal" />
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
