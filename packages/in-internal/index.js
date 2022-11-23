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
import Metrics from 'in-internal/thisUnit/Metrics/Metrics';
import Kafka from 'in-internal/monitoringUnit/sre/Kafka';
import Unit from 'in-internal/monitoringUnit/unit/Unit';
import Region from 'in-internal/monitoringUnit/Region';
import Landing from 'in-internal/components/Landing';
import Agents from 'in-internal/thisUnit/Agents';

export default function Internal() {
  const internalRoutes = internalMonitoringUnit
    ? [
        <Route key="unitList" path="/internal/monitoringUnit/units" component={UnitList} />,
        <Route key="unit" path="/internal/monitoringUnit/unit" component={Unit} />,
        <Route key="agentAcrossUnits" path="/internal/monitoringUnit/agents" component={AgentsAcrossUnits} />,

        <Route key="region" path="/internal/monitoringUnit/region" children={wrapInInternalView(Region)} />,
        <Route
          key="sloViolations"
          path="/internal/monitoringUnit/sloViolations"
          children={wrapInInternalView(SloViolations)}
        />,
        <Route
          key="eumAcceptor"
          path="/internal/monitoringUnit/eum/eum-acceptor"
          children={wrapInInternalView(EumAcceptor)}
        />,
        <Route
          key="eumProcessor"
          path="/internal/monitoringUnit/eum/eum-processor"
          children={wrapInInternalView(EumProcessor)}
        />,
        <Route
          key="appdataWriter"
          path="/internal/monitoringUnit/eum/appdata-writer"
          children={wrapInInternalView(AppDataWriterForEum)}
        />,
        <Route
          key="errorSimulator"
          path="/internal/monitoringUnit/eum/errorSimulator"
          children={wrapInInternalView(ErrorSimulator)}
        />,
        <Route
          key="jsStackTraceTranslator"
          path="/internal/monitoringUnit/eum/jsStackTraceTranslator"
          children={wrapInInternalView(JsStackTraceTranslator)}
        />,
        <Route
          key="eumHealthProcessor"
          path="/internal/monitoringUnit/eum/eumHealthProcessor"
          children={wrapInInternalView(EumHealthProcessor)}
        />,
        <Route key="eum" path="/internal/monitoringUnit/eum" children={wrapInInternalView(EumOverview)} />,
        <Route
          key="fillerStats"
          path="/internal/monitoringUnit/fillerStats"
          children={wrapInInternalView(FillerStats)}
        />,
        <Route
          key="appdataBatchingInsights"
          path="/internal/monitoringUnit/appdataBatchingInsights"
          children={wrapInInternalView(BatchingInsights)}
        />,
        <Route key="appdata" path="/internal/monitoringUnit/appdata" children={wrapInInternalView(Appdata)} />,
        <Route
          key="appdataLiveAggregator"
          path="/internal/monitoringUnit/appdataLiveAggregator"
          children={wrapInInternalView(AppDataLiveAggregatorOverview)}
        />,
        <Route key="appdata" path="/internal/monitoringUnit/appdata" children={wrapInInternalView(Appdata)} />,
        <Route
          key="appdataHealthAggregator"
          path="/internal/monitoringUnit/appdataHealthAggregator"
          children={wrapInInternalView(AppDataHealthAggregator)}
        />,
        <Route
          key="appdataHealthProcessor"
          path="/internal/monitoringUnit/appdataHealthProcessor"
          children={wrapInInternalView(AppDataHealthProcessor)}
        />,
        <Route
          key="appdataProcessing"
          path="/internal/monitoringUnit/appdataProcessing"
          children={wrapInInternalView(AppDataProcessorStatistics)}
        />,
        <Route
          key="callExtraction"
          path="/internal/monitoringUnit/callExtraction"
          children={wrapInInternalView(CallExtraction)}
        />,
        <Route
          key="appDataQueryPerformance"
          path="/internal/monitoringUnit/appDataQueryPerformance"
          children={wrapInInternalView(AppDataQueryPerformance)}
        />,
        <Route
          key="resilientMapping"
          path="/internal/monitoringUnit/resilientMapping"
          children={wrapInInternalView(ResilientMapping)}
        />,
        <Route
          key="acceptors"
          path="/internal/monitoringUnit/sre/acceptors"
          children={wrapInInternalView(Acceptors)}
        />,
        <Route
          key="beeInstanaAggregators"
          path="/internal/monitoringUnit/sre/beeinstanaaggregators"
          children={wrapInInternalView(BeeInstanaAggregators)}
        />,
        <Route
          key="beeInstanaIngestors"
          path="/internal/monitoringUnit/sre/beeinstanaingestors"
          children={wrapInInternalView(BeeInstanaIngestors)}
        />,
        <Route
          key="metricsCassandra"
          path="/internal/monitoringUnit/sre/metricscassandra"
          children={wrapInInternalView(MetricsCassandra)}
        />,
        <Route
          key="spansCassandra"
          path="/internal/monitoringUnit/sre/spanscassandra"
          children={wrapInInternalView(SpansCassandra)}
        />,
        <Route
          key="profilescassandra"
          path="/internal/monitoringUnit/sre/profilescassandra"
          children={wrapInInternalView(ProfilesCassandra)}
        />,
        <Route
          key="statecassandra"
          path="/internal/monitoringUnit/sre/statecassandra"
          children={wrapInInternalView(StateCassandra)}
        />,
        <Route
          key="clickhouse"
          path="/internal/monitoringUnit/sre/clickhouse"
          children={wrapInInternalView(Clickhouse)}
        />,
        <Route
          key="clickhouseLogs"
          path="/internal/monitoringUnit/sre/clickhouseLogs"
          children={wrapInInternalView(ClickhouseLogs)}
        />,
        <Route
          key="clickhouseTableSizes"
          path="/internal/monitoringUnit/sre/clickhouseTableSizes"
          children={wrapInInternalView(ClickhouseTotalTableSizes)}
        />,
        <Route key="elastic" path="/internal/monitoringUnit/sre/elastic" children={wrapInInternalView(MetaElastic)} />,
        <Route
          key="elasticng"
          path="/internal/monitoringUnit/sre/elasticng"
          children={wrapInInternalView(MetaElasticNG)}
        />,
        <Route key="kafka" path="/internal/monitoringUnit/sre/kafka" children={wrapInInternalView(Kafka)} />,
        <Route
          key="serverlessacceptors"
          path="/internal/monitoringUnit/serverless/serverlessacceptors"
          children={wrapInInternalView(ServerlessAcceptors)}
        />,
        <Route
          key="cashiers"
          path="/internal/monitoringUnit/cashier/cashiers"
          children={wrapInInternalView(Cashiers)}
        />,
        <Route
          key="filler"
          path="/internal/monitoringUnit/infrastructureMetrics/filler"
          children={wrapInInternalView(FillerInfrastructureMetrics)}
        />,
        <Route key="hubforce" path="/internal/monitoringUnit/hubforce" children={wrapInInternalView(Hubforce)} />
      ]
    : [];
  internalRoutes.push(
    <Route
      key="logProcessor"
      path="/internal/monitoringUnit/log/LogProcessor"
      children={wrapInInternalView(LogProcessor)}
    />,
    <Route key="logWriter" path="/internal/monitoringUnit/log/LogWriter" children={wrapInInternalView(LogWriter)} />,
    <Route key="logReader" path="/internal/monitoringUnit/log/LogReader" children={wrapInInternalView(LogReader)} />,
    <Route
      key="logHousekeeping"
      path="/internal/monitoringUnit/log/LogHousekeeping"
      children={wrapInInternalView(LogHousekeeping)}
    />,

    <Route
      key="syntheticAcceptor"
      path="/internal/monitoringUnit/synthetics/SyntheticAcceptor"
      children={wrapInInternalView(SyntheticsAcceptor)}
    />,
    <Route
      key="syntheticsWriter"
      path="/internal/monitoringUnit/synthetics/SyntheticsWriter"
      children={wrapInInternalView(SyntheticsWriter)}
    />,
    <Route
      key="syntheticsReader"
      path="/internal/monitoringUnit/synthetics/SyntheticsReader"
      children={wrapInInternalView(SyntheticsReader)}
    />,
    <Route key="entityStatistics" path="/internal/thisUnit/entityStatistics" component={EntityStatistics} />,
    <Route key="graphExplorer" path="/internal/thisUnit/graphExplorer" children={wrapInInternalView(GraphExplorer)} />,
    <Route
      key="snapshotVersions"
      path="/internal/thisUnit/snapshotVersions"
      children={wrapInInternalView(SnapshotVersions)}
    />,
    <Route
      key="internalEvents"
      path="/internal/thisUnit/internalEvents"
      children={wrapInInternalView(InternalEvents)}
    />,
    <Route key="metrics" path="/internal/thisUnit/metrics" children={wrapInInternalView(Metrics)} />,
    <Route key="agents" path="/internal/thisUnit/agents" component={Agents} />,
    <Route key="wsApiTester" path="/internal/thisUnit/wsApiTester" children={wrapInInternalView(WsApiTester)} />,
    <Route
      key="adaptiveBaselineMode"
      path="/internal/thisUnit/adaptiveBaselineModel"
      children={wrapInInternalView(AdaptiveBaselineModel)}
    />,
    <Route key="internalLanding" exact path="/internal" children={wrapInInternalView(Landing)} />
  );
  return internalRoutes;
}

const wrapInInternalView = Component => {
  return (
    <InternalViewWrapper>
      <RenderWithRouteProps Component={Component} />
    </InternalViewWrapper>
  );
};
