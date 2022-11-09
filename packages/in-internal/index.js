/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route } from 'react-router-dom';
import React from 'react';

// features available on customer units
import AppDataProcessorStatistics from 'in-internal/monitoringUnit/Appdata/AppDataProcessorStatistics';
// features for monitoring units
import AppDataLiveAggregatorOverview from 'in-internal/monitoringUnit/Appdata/AppDataLiveAggregatorOverview';
import FillerInfrastructureMetrics from 'in-internal/monitoringUnit/infrastructureMetrics/Filler';
import AppDataQueryPerformance from 'in-internal/monitoringUnit/Appdata/AppDataQueryPerformance';
import ClickhouseTotalTableSizes from 'in-internal/monitoringUnit/sre/ClickhouseTotalTableSizes';
import AppDataHealthAggregator from 'in-internal/monitoringUnit/Appdata/AppDataHealthAggregator';
// General imports
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import AdaptiveBaselineModel from 'in-internal/thisUnit/AdaptiveBaseline/AdaptiveBaselineModel';
import AppDataHealthProcessor from 'in-internal/monitoringUnit/Appdata/AppDataHealthProcessor';
import ServerlessAcceptors from 'in-internal/monitoringUnit/serverless/ServerlessAcceptors';
import JsStackTraceTranslator from 'in-internal/monitoringUnit/eum/JsStackTraceTranslator';
import SyntheticsAcceptor from 'in-internal/monitoringUnit/synthetics/SyntheticsAcceptor';
import BeeInstanaAggregators from 'in-internal/monitoringUnit/sre/BeeInstanaAggregators';
import SnapshotVersions from 'in-internal/thisUnit/SnapshotVersions/SnapshotVersions';
import SyntheticsReader from 'in-internal/monitoringUnit/synthetics/SyntheticsReader';
import SyntheticsWriter from 'in-internal/monitoringUnit/synthetics/SyntheticsWriter';
import BeeInstanaIngestors from 'in-internal/monitoringUnit/sre/BeeInstanaIngestors';
import EumHealthProcessor from 'in-internal/monitoringUnit/eum/EumHealthProcessor';
import SloViolations from 'in-internal/monitoringUnit/SloViolations/SloViolations';
import ResilientMapping from 'in-internal/monitoringUnit/Appdata/ResilientMapping';
import BatchingInsights from 'in-internal/monitoringUnit/Appdata/BatchingInsights';
import { RenderWithRouteProps } from 'in-components/routing/createAsyncComponent';
import ProfilesCassandra from 'in-internal/monitoringUnit/sre/ProfilesCassandra';
import InternalEvents from 'in-internal/thisUnit/InternalEvents/InternalEvents';
import MetricsCassandra from 'in-internal/monitoringUnit/sre/MetricsCassandra';
import CallExtraction from 'in-internal/monitoringUnit/Appdata/CallExtraction';
import AppDataWriterForEum from 'in-internal/monitoringUnit/eum/AppDataWriter';
import GraphExplorer from 'in-internal/thisUnit/GraphExplorer/GraphExplorer';
import LogHousekeeping from 'in-internal/monitoringUnit/log/LogHousekeeping';
import ErrorSimulator from 'in-internal/monitoringUnit/eum/ErrorSimulator';
import SpansCassandra from 'in-internal/monitoringUnit/sre/SpansCassandra';
import StateCassandra from 'in-internal/monitoringUnit/sre/StateCassandra';
import ClickhouseLogs from 'in-internal/monitoringUnit/sre/ClickhouseLogs';
import { WsApiTester } from 'in-internal/thisUnit/WsApiTester/WsApiTester';
import MetaElasticNG from 'in-internal/monitoringUnit/sre/MetaElasticNG';
import EumProcessor from 'in-internal/monitoringUnit/eum/EumProcessor';
import LogProcessor from 'in-internal/monitoringUnit/log/LogProcessor';
import EntityStatistics from 'in-internal/thisUnit/EntityStatistics';
import MetaElastic from 'in-internal/monitoringUnit/sre/MetaElastic';
import EumAcceptor from 'in-internal/monitoringUnit/eum/EumAcceptor';
import Hubforce from 'in-internal/monitoringUnit/hubforce/Hubforce';
import Clickhouse from 'in-internal/monitoringUnit/sre/Clickhouse';
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
import Metrics from 'in-internal/thisUnit/Metrics/Metrics';
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

          <Route path="/internal/monitoringUnit/region" children={wrapInInternalView(Region)} />
          <Route path="/internal/monitoringUnit/sloViolations" children={wrapInInternalView(SloViolations)} />
          <Route path="/internal/monitoringUnit/eum/eum-acceptor" children={wrapInInternalView(EumAcceptor)} />
          <Route path="/internal/monitoringUnit/eum/eum-processor" children={wrapInInternalView(EumProcessor)} />
          <Route
            path="/internal/monitoringUnit/eum/appdata-writer"
            children={wrapInInternalView(AppDataWriterForEum)}
          />
          <Route path="/internal/monitoringUnit/eum/errorSimulator" children={wrapInInternalView(ErrorSimulator)} />
          <Route
            path="/internal/monitoringUnit/eum/jsStackTraceTranslator"
            children={wrapInInternalView(JsStackTraceTranslator)}
          />
          <Route
            path="/internal/monitoringUnit/eum/eumHealthProcessor"
            children={wrapInInternalView(EumHealthProcessor)}
          />
          <Route path="/internal/monitoringUnit/eum" children={wrapInInternalView(EumOverview)} />
          <Route path="/internal/monitoringUnit/fillerStats" children={wrapInInternalView(FillerStats)} />
          <Route
            path="/internal/monitoringUnit/appdataBatchingInsights"
            children={wrapInInternalView(BatchingInsights)}
          />
          <Route path="/internal/monitoringUnit/appdata" children={wrapInInternalView(Appdata)} />
          <Route
            path="/internal/monitoringUnit/appdataLiveAggregator"
            children={wrapInInternalView(AppDataLiveAggregatorOverview)}
          />
          <Route path="/internal/monitoringUnit/appdata" children={wrapInInternalView(Appdata)} />
          <Route
            path="/internal/monitoringUnit/appdataHealthAggregator"
            children={wrapInInternalView(AppDataHealthAggregator)}
          />
          <Route
            path="/internal/monitoringUnit/appdataHealthProcessor"
            children={wrapInInternalView(AppDataHealthProcessor)}
          />
          <Route
            path="/internal/monitoringUnit/appdataProcessing"
            children={wrapInInternalView(AppDataProcessorStatistics)}
          />
          <Route path="/internal/monitoringUnit/callExtraction" children={wrapInInternalView(CallExtraction)} />
          <Route
            path="/internal/monitoringUnit/appDataQueryPerformance"
            children={wrapInInternalView(AppDataQueryPerformance)}
          />
          <Route path="/internal/monitoringUnit/resilientMapping" children={wrapInInternalView(ResilientMapping)} />
          <Route path="/internal/monitoringUnit/sre/acceptors" children={wrapInInternalView(Acceptors)} />
          <Route
            path="/internal/monitoringUnit/sre/beeinstanaaggregators"
            children={wrapInInternalView(BeeInstanaAggregators)}
          />
          <Route
            path="/internal/monitoringUnit/sre/beeinstanaingestors"
            children={wrapInInternalView(BeeInstanaIngestors)}
          />
          <Route path="/internal/monitoringUnit/sre/metricscassandra" children={wrapInInternalView(MetricsCassandra)} />
          <Route path="/internal/monitoringUnit/sre/spanscassandra" children={wrapInInternalView(SpansCassandra)} />
          <Route
            path="/internal/monitoringUnit/sre/profilescassandra"
            children={wrapInInternalView(ProfilesCassandra)}
          />
          <Route path="/internal/monitoringUnit/sre/statecassandra" children={wrapInInternalView(StateCassandra)} />
          <Route path="/internal/monitoringUnit/sre/clickhouse" children={wrapInInternalView(Clickhouse)} />
          <Route path="/internal/monitoringUnit/sre/clickhouseLogs" children={wrapInInternalView(ClickhouseLogs)} />
          <Route
            path="/internal/monitoringUnit/sre/clickhouseTableSizes"
            children={wrapInInternalView(ClickhouseTotalTableSizes)}
          />
          <Route path="/internal/monitoringUnit/sre/elastic" children={wrapInInternalView(MetaElastic)} />
          <Route path="/internal/monitoringUnit/sre/elasticng" children={wrapInInternalView(MetaElasticNG)} />
          <Route path="/internal/monitoringUnit/sre/kafka" children={wrapInInternalView(Kafka)} />
          <Route
            path="/internal/monitoringUnit/serverless/serverlessacceptors"
            children={wrapInInternalView(ServerlessAcceptors)}
          />
          <Route path="/internal/monitoringUnit/cashier/cashiers" children={wrapInInternalView(Cashiers)} />
          <Route
            path="/internal/monitoringUnit/infrastructureMetrics/filler"
            children={wrapInInternalView(FillerInfrastructureMetrics)}
          />
          <Route path="/internal/monitoringUnit/hubforce" children={wrapInInternalView(Hubforce)} />
        </>
      )}

      <Route path="/internal/monitoringUnit/log/LogProcessor" children={wrapInInternalView(LogProcessor)} />
      <Route path="/internal/monitoringUnit/log/LogWriter" children={wrapInInternalView(LogWriter)} />
      <Route path="/internal/monitoringUnit/log/LogReader" children={wrapInInternalView(LogReader)} />
      <Route path="/internal/monitoringUnit/log/LogHousekeeping" children={wrapInInternalView(LogHousekeeping)} />

      <Route
        path="/internal/monitoringUnit/synthetics/SyntheticAcceptor"
        children={wrapInInternalView(SyntheticsAcceptor)}
      />
      <Route
        path="/internal/monitoringUnit/synthetics/SyntheticsWriter"
        children={wrapInInternalView(SyntheticsWriter)}
      />
      <Route
        path="/internal/monitoringUnit/synthetics/SyntheticsReader"
        children={wrapInInternalView(SyntheticsReader)}
      />

      <>
        <Route path="/internal/thisUnit/entityStatistics" component={EntityStatistics} />
        <Route path="/internal/thisUnit/graphExplorer" children={wrapInInternalView(GraphExplorer)} />
        <Route path="/internal/thisUnit/snapshotVersions" children={wrapInInternalView(SnapshotVersions)} />
        <Route path="/internal/thisUnit/internalEvents" children={wrapInInternalView(InternalEvents)} />
        <Route path="/internal/thisUnit/metrics" children={wrapInInternalView(Metrics)} />
        <Route path="/internal/thisUnit/agents" component={Agents} />
        <Route path="/internal/thisUnit/wsApiTester" children={wrapInInternalView(WsApiTester)} />
        <Route path="/internal/thisUnit/adaptiveBaselineModel" children={wrapInInternalView(AdaptiveBaselineModel)} />
      </>

      <Route path="/internal" children={wrapInInternalView(Landing)} />
    </Switch>
  );
}

const wrapInInternalView = Component => {
  return (
    <InternalViewWrapper>
      <RenderWithRouteProps Component={Component} />
    </InternalViewWrapper>
  );
};
