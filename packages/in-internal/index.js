/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Redirect } from 'react-router-dom';
import React from 'react';

// features available on customer units
import AppDataProcessorStatistics from 'in-internal/monitoringUnit/Appdata/AppDataProcessorStatistics';
// features for monitoring units
import AppDataLiveAggregatorOverview from 'in-internal/monitoringUnit/Appdata/AppDataLiveAggregatorOverview';
import SyntheticsHealthProcessor from 'in-internal/monitoringUnit/synthetics/SyntheticsHealthProcessor';
import FillerInfrastructureMetrics from 'in-internal/monitoringUnit/infrastructureMetrics/Filler';
import AppDataQueryPerformance from 'in-internal/monitoringUnit/Appdata/AppDataQueryPerformance';
import ClickhouseTotalTableSizes from 'in-internal/monitoringUnit/sre/ClickhouseTotalTableSizes';
import AppDataHealthAggregator from 'in-internal/monitoringUnit/Appdata/AppDataHealthAggregator';
import AdaptiveBaselineModel from 'in-internal/thisUnit/AdaptiveBaseline/AdaptiveBaselineModel';
// General imports
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
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
import OTLPAcceptor from 'in-internal/monitoringUnit/otlpAcceptor/OtlpAcceptor';
import MetricsCassandra from 'in-internal/monitoringUnit/sre/MetricsCassandra';
import CallExtraction from 'in-internal/monitoringUnit/Appdata/CallExtraction';
import AppDataWriterForEum from 'in-internal/monitoringUnit/eum/AppDataWriter';
import GraphExplorer from 'in-internal/thisUnit/GraphExplorer/GraphExplorer';
import EumComponentMetrics from 'in-internal/thisUnit/EumComponentMetrics';
import ErrorSimulator from 'in-internal/monitoringUnit/eum/ErrorSimulator';
import SpansCassandra from 'in-internal/monitoringUnit/sre/SpansCassandra';
import StateCassandra from 'in-internal/monitoringUnit/sre/StateCassandra';
import ClickhouseLogs from 'in-internal/monitoringUnit/sre/ClickhouseLogs';
import { WsApiTester } from 'in-internal/thisUnit/WsApiTester/WsApiTester';
import MetaElasticNG from 'in-internal/monitoringUnit/sre/MetaElasticNG';
import EumProcessor from 'in-internal/monitoringUnit/eum/EumProcessor';
import EntityStatistics from 'in-internal/thisUnit/EntityStatistics';
import MetaElastic from 'in-internal/monitoringUnit/sre/MetaElastic';
import EumAcceptor from 'in-internal/monitoringUnit/eum/EumAcceptor';
import Hubforce from 'in-internal/monitoringUnit/hubforce/Hubforce';
import Clickhouse from 'in-internal/monitoringUnit/sre/Clickhouse';
import Cashiers from 'in-internal/monitoringUnit/cashier/Cashiers';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import EumOverview from 'in-internal/monitoringUnit/eum/Overview';
import AgentsAcrossUnits from 'in-internal/monitoringUnit/Agents';
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
        <Route key="internalUnitList" path="/internal/monitoringUnit/units" component={UnitList} />,
        <Route key="internalUnit" path="/internal/monitoringUnit/unit" component={Unit} />,
        <Route key="internalAgentAcrossUnits" path="/internal/monitoringUnit/agents" component={AgentsAcrossUnits} />,

        <Route key="internalRegion" path="/internal/monitoringUnit/region" children={wrapInInternalView(Region)} />,
        <Route
          key="internalSloViolations"
          path="/internal/monitoringUnit/sloViolations"
          children={wrapInInternalView(SloViolations)}
        />,
        <Route
          key="internalEumAcceptor"
          path="/internal/monitoringUnit/eum/eum-acceptor"
          children={wrapInInternalView(EumAcceptor)}
        />,
        <Route
          key="internalEumProcessor"
          path="/internal/monitoringUnit/eum/eum-processor"
          children={wrapInInternalView(EumProcessor)}
        />,
        <Route
          key="internalAppdataWriter"
          path="/internal/monitoringUnit/eum/appdata-writer"
          children={wrapInInternalView(AppDataWriterForEum)}
        />,
        <Route
          key="internalErrorSimulator"
          path="/internal/monitoringUnit/eum/errorSimulator"
          children={wrapInInternalView(ErrorSimulator)}
        />,
        <Route
          key="internalJsStackTraceTranslator"
          path="/internal/monitoringUnit/eum/jsStackTraceTranslator"
          children={wrapInInternalView(JsStackTraceTranslator)}
        />,
        <Route
          key="internalEumHealthProcessor"
          path="/internal/monitoringUnit/eum/eumHealthProcessor"
          children={wrapInInternalView(EumHealthProcessor)}
        />,
        <Route
          key="internalEum"
          path="/internal/monitoringUnit/eum/overview"
          children={wrapInInternalView(EumOverview)}
        />,
        <Route
          key="internalFillerStats"
          path="/internal/monitoringUnit/fillerStats"
          children={wrapInInternalView(FillerStats)}
        />,
        <Route
          key="internalAppdataBatchingInsights"
          path="/internal/monitoringUnit/appdataBatchingInsights"
          children={wrapInInternalView(BatchingInsights)}
        />,
        <Route
          key="internalAppdataLiveAggregator"
          path="/internal/monitoringUnit/appdataLiveAggregator"
          children={wrapInInternalView(AppDataLiveAggregatorOverview)}
        />,
        <Route key="internalAppdata" path="/internal/monitoringUnit/appdata" children={wrapInInternalView(Appdata)} />,
        <Route
          key="internalAppdataHealthAggregator"
          path="/internal/monitoringUnit/appdataHealthAggregator"
          children={wrapInInternalView(AppDataHealthAggregator)}
        />,
        <Route
          key="internalAppdataHealthProcessor"
          path="/internal/monitoringUnit/appdataHealthProcessor"
          children={wrapInInternalView(AppDataHealthProcessor)}
        />,
        <Route
          key="internalAppdataProcessing"
          path="/internal/monitoringUnit/appdataProcessing"
          children={wrapInInternalView(AppDataProcessorStatistics)}
        />,
        <Route
          key="internalCallExtraction"
          path="/internal/monitoringUnit/callExtraction"
          children={wrapInInternalView(CallExtraction)}
        />,
        <Route
          key="internalAppDataQueryPerformance"
          path="/internal/monitoringUnit/appDataQueryPerformance"
          children={wrapInInternalView(AppDataQueryPerformance)}
        />,
        <Route
          key="internalResilientMapping"
          path="/internal/monitoringUnit/resilientMapping"
          children={wrapInInternalView(ResilientMapping)}
        />,
        <Route
          key="internalAcceptors"
          path="/internal/monitoringUnit/sre/acceptors"
          children={wrapInInternalView(Acceptors)}
        />,
        <Route
          key="internalBeeInstanaAggregators"
          path="/internal/monitoringUnit/sre/beeinstanaaggregators"
          children={wrapInInternalView(BeeInstanaAggregators)}
        />,
        <Route
          key="internalBeeInstanaIngestors"
          path="/internal/monitoringUnit/sre/beeinstanaingestors"
          children={wrapInInternalView(BeeInstanaIngestors)}
        />,
        <Route
          key="internalMetricsCassandra"
          path="/internal/monitoringUnit/sre/metricscassandra"
          children={wrapInInternalView(MetricsCassandra)}
        />,
        <Route
          key="internalSpansCassandra"
          path="/internal/monitoringUnit/sre/spanscassandra"
          children={wrapInInternalView(SpansCassandra)}
        />,
        <Route
          key="internalProfilescassandra"
          path="/internal/monitoringUnit/sre/profilescassandra"
          children={wrapInInternalView(ProfilesCassandra)}
        />,
        <Route
          key="internalStatecassandra"
          path="/internal/monitoringUnit/sre/statecassandra"
          children={wrapInInternalView(StateCassandra)}
        />,
        <Route
          key="internalClickhouse"
          path="/internal/monitoringUnit/sre/clickhouse"
          children={wrapInInternalView(Clickhouse)}
        />,
        <Route
          key="internalClickhouseLogs"
          path="/internal/monitoringUnit/sre/clickhouseLogs"
          children={wrapInInternalView(ClickhouseLogs)}
        />,
        <Route
          key="internalClickhouseTableSizes"
          path="/internal/monitoringUnit/sre/clickhouseTableSizes"
          children={wrapInInternalView(ClickhouseTotalTableSizes)}
        />,
        <Route
          key="internalElastic"
          path="/internal/monitoringUnit/sre/elastic"
          children={wrapInInternalView(MetaElastic)}
        />,
        <Route
          key="internalElasticng"
          path="/internal/monitoringUnit/sre/elasticng"
          children={wrapInInternalView(MetaElasticNG)}
        />,
        <Route key="internalKafka" path="/internal/monitoringUnit/sre/kafka" children={wrapInInternalView(Kafka)} />,
        <Route
          key="internalServerlessacceptors"
          path="/internal/monitoringUnit/serverless/serverlessacceptors"
          children={wrapInInternalView(ServerlessAcceptors)}
        />,
        <Route
          key="otlpAcceptors"
          path="/internal/monitoringUnit/otlpAcceptors"
          children={wrapInInternalView(OTLPAcceptor)}
        />,
        <Route
          key="internalCashiers"
          path="/internal/monitoringUnit/cashier/cashiers"
          children={wrapInInternalView(Cashiers)}
        />,
        <Route
          key="internalFiller"
          path="/internal/monitoringUnit/infrastructureMetrics/filler"
          children={wrapInInternalView(FillerInfrastructureMetrics)}
        />,
        <Route
          key="internalHubforce"
          path="/internal/monitoringUnit/hubforce"
          children={wrapInInternalView(Hubforce)}
        />
      ]
    : [];
  internalRoutes.push(

    <Route
      key="internalSyntheticAcceptor"
      path="/internal/monitoringUnit/synthetics/SyntheticAcceptor"
      children={wrapInInternalView(SyntheticsAcceptor)}
    />,
    <Route
      key="internalSyntheticsHealthProcessor"
      path="/internal/monitoringUnit/synthetics/SyntheticsHealthProcessor"
      children={wrapInInternalView(SyntheticsHealthProcessor)}
    />,
    <Route
      key="internalSyntheticsWriter"
      path="/internal/monitoringUnit/synthetics/SyntheticsWriter"
      children={wrapInInternalView(SyntheticsWriter)}
    />,
    <Route
      key="internalSyntheticsReader"
      path="/internal/monitoringUnit/synthetics/SyntheticsReader"
      children={wrapInInternalView(SyntheticsReader)}
    />,
    <Route key="internalEntityStatistics" path="/internal/thisUnit/entityStatistics" component={EntityStatistics} />,
    <Route
      key="internalGraphExplorer"
      path="/internal/thisUnit/graphExplorer"
      children={wrapInInternalView(GraphExplorer)}
    />,
    <Route
      key="internalSnapshotVersions"
      path="/internal/thisUnit/snapshotVersions"
      children={wrapInInternalView(SnapshotVersions)}
    />,
    <Route
      key="internalEvents"
      path="/internal/thisUnit/internalEvents"
      children={wrapInInternalView(InternalEvents)}
    />,
    <Route key="internalMetrics" path="/internal/thisUnit/metrics" children={wrapInInternalView(Metrics)} />,
    <Route key="internalAgents" path="/internal/thisUnit/agents" component={Agents} />,
    <Route
      key="internalWsApiTester"
      path="/internal/thisUnit/wsApiTester"
      children={wrapInInternalView(WsApiTester)}
    />,
    <Route
      key="internalAdaptiveBaselineMode"
      path="/internal/thisUnit/adaptiveBaselineModel"
      children={wrapInInternalView(AdaptiveBaselineModel)}
    />,
    <Route key="internalEumComponentMetrics" path="/internal/thisUnit/eum" component={EumComponentMetrics} />,
    <Route key="internalLanding" exact path="/internal" children={wrapInInternalView(Landing)} />,
    <Route key='internalRedirect' path="*">
      <Redirect to="/internal" />
    </Route>
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
