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
import TagProcessorState from 'in-internal/thisUnit/TagProcessor/TagProcessorState';
import EumHealthProcessor from 'in-internal/monitoringUnit/eum/EumHealthProcessor';
import LogHealthProcessor from 'in-internal/monitoringUnit/log/LogHealthProcessor';
import SloViolations from 'in-internal/monitoringUnit/SloViolations/SloViolations';
import ResilientMapping from 'in-internal/monitoringUnit/Appdata/ResilientMapping';
import BatchingInsights from 'in-internal/monitoringUnit/Appdata/BatchingInsights';
import BytesIngestedStatistics from 'in-internal/thisUnit/BytesIngestedStatistics';
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
import FeatureFlags from 'in-internal/monitoringUnit/FeatureFlags';
import Clickhouse from 'in-internal/monitoringUnit/sre/Clickhouse';
import Cashiers from 'in-internal/monitoringUnit/cashier/Cashiers';
import { internalMonitoringUnit } from 'in-services/featureFlags';
import EumOverview from 'in-internal/monitoringUnit/eum/Overview';
import AgentsAcrossUnits from 'in-internal/monitoringUnit/Agents';
import UnitList from 'in-internal/monitoringUnit/units/UnitList';
import FillerStats from 'in-internal/monitoringUnit/FillerStats';
import Appdata from 'in-internal/monitoringUnit/Appdata/Appdata';
import Acceptors from 'in-internal/monitoringUnit/sre/Acceptors';
import TagSets from 'in-internal/thisUnit/TagProcessor/TagSets';
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

        <Route key="internalRegion" path="/internal/monitoringUnit/region">
          {wrapInInternalView(Region)}
        </Route>,
        <Route key="internalSloViolations" path="/internal/monitoringUnit/sloViolations">
          {wrapInInternalView(SloViolations)}
        </Route>,
        <Route key="internalEumAcceptor" path="/internal/monitoringUnit/eum/eum-acceptor">
          {wrapInInternalView(EumAcceptor)}
        </Route>,
        <Route key="internalEumProcessor" path="/internal/monitoringUnit/eum/eum-processor">
          {wrapInInternalView(EumProcessor)}
        </Route>,
        <Route key="internalAppdataWriter" path="/internal/monitoringUnit/eum/appdata-writer">
          {wrapInInternalView(AppDataWriterForEum)}
        </Route>,
        <Route key="internalErrorSimulator" path="/internal/monitoringUnit/eum/errorSimulator">
          {wrapInInternalView(ErrorSimulator)}
        </Route>,
        <Route key="internalJsStackTraceTranslator" path="/internal/monitoringUnit/eum/jsStackTraceTranslator">
          {wrapInInternalView(JsStackTraceTranslator)}
        </Route>,
        <Route key="internalEumHealthProcessor" path="/internal/monitoringUnit/eum/eumHealthProcessor">
          {wrapInInternalView(EumHealthProcessor)}
        </Route>,
        <Route key="internalLogHealthProcessor" path="/internal/monitoringUnit/log/logHealthProcessor">
          {wrapInInternalView(LogHealthProcessor)}
        </Route>,
        <Route key="internalEum" path="/internal/monitoringUnit/eum/overview">
          {wrapInInternalView(EumOverview)}
        </Route>,
        <Route key="internalFillerStats" path="/internal/monitoringUnit/fillerStats">
          {wrapInInternalView(FillerStats)}
        </Route>,
        <Route key="internalAppdataBatchingInsights" path="/internal/monitoringUnit/appdataBatchingInsights">
          {wrapInInternalView(BatchingInsights)}
        </Route>,
        <Route key="internalAppdataLiveAggregator" path="/internal/monitoringUnit/appdataLiveAggregator">
          {wrapInInternalView(AppDataLiveAggregatorOverview)}
        </Route>,
        <Route key="internalAppdata" path="/internal/monitoringUnit/appdata">
          {wrapInInternalView(Appdata)}
        </Route>,
        <Route key="internalAppdataHealthAggregator" path="/internal/monitoringUnit/appdataHealthAggregator">
          {wrapInInternalView(AppDataHealthAggregator)}
        </Route>,
        <Route key="internalAppdataHealthProcessor" path="/internal/monitoringUnit/appdataHealthProcessor">
          {wrapInInternalView(AppDataHealthProcessor)}
        </Route>,
        <Route key="internalAppdataProcessing" path="/internal/monitoringUnit/appdataProcessing">
          {wrapInInternalView(AppDataProcessorStatistics)}
        </Route>,
        <Route key="internalCallExtraction" path="/internal/monitoringUnit/callExtraction">
          {wrapInInternalView(CallExtraction)}
        </Route>,
        <Route key="internalAppDataQueryPerformance" path="/internal/monitoringUnit/appDataQueryPerformance">
          {wrapInInternalView(AppDataQueryPerformance)}
        </Route>,
        <Route key="internalResilientMapping" path="/internal/monitoringUnit/resilientMapping">
          {wrapInInternalView(ResilientMapping)}
        </Route>,
        <Route key="internalAcceptors" path="/internal/monitoringUnit/sre/acceptors">
          {wrapInInternalView(Acceptors)}
        </Route>,
        <Route key="internalBeeInstanaAggregators" path="/internal/monitoringUnit/sre/beeinstanaaggregators">
          {wrapInInternalView(BeeInstanaAggregators)}
        </Route>,
        <Route key="internalBeeInstanaIngestors" path="/internal/monitoringUnit/sre/beeinstanaingestors">
          {wrapInInternalView(BeeInstanaIngestors)}
        </Route>,
        <Route key="internalMetricsCassandra" path="/internal/monitoringUnit/sre/metricscassandra">
          {wrapInInternalView(MetricsCassandra)}
        </Route>,
        <Route key="internalSpansCassandra" path="/internal/monitoringUnit/sre/spanscassandra">
          {wrapInInternalView(SpansCassandra)}
        </Route>,
        <Route key="internalProfilescassandra" path="/internal/monitoringUnit/sre/profilescassandra">
          {wrapInInternalView(ProfilesCassandra)}
        </Route>,
        <Route key="internalStatecassandra" path="/internal/monitoringUnit/sre/statecassandra">
          {wrapInInternalView(StateCassandra)}
        </Route>,
        <Route key="internalClickhouse" path="/internal/monitoringUnit/sre/clickhouse">
          {wrapInInternalView(Clickhouse)}
        </Route>,
        <Route key="internalClickhouseLogs" path="/internal/monitoringUnit/sre/clickhouseLogs">
          {wrapInInternalView(ClickhouseLogs)}
        </Route>,
        <Route key="internalClickhouseTableSizes" path="/internal/monitoringUnit/sre/clickhouseTableSizes">
          {wrapInInternalView(ClickhouseTotalTableSizes)}
        </Route>,
        <Route key="internalElastic" path="/internal/monitoringUnit/sre/elastic">
          {wrapInInternalView(MetaElastic)}
        </Route>,
        <Route key="internalElasticng" path="/internal/monitoringUnit/sre/elasticng">
          {wrapInInternalView(MetaElasticNG)}
        </Route>,
        <Route key="internalKafka" path="/internal/monitoringUnit/sre/kafka">
          {wrapInInternalView(Kafka)}
        </Route>,
        <Route key="internalServerlessacceptors" path="/internal/monitoringUnit/serverless/serverlessacceptors">
          {wrapInInternalView(ServerlessAcceptors)}
        </Route>,
        <Route key="otlpAcceptors" path="/internal/monitoringUnit/otlpAcceptors">
          {wrapInInternalView(OTLPAcceptor)}
        </Route>,
        <Route key="internalCashiers" path="/internal/monitoringUnit/cashier/cashiers">
          {wrapInInternalView(Cashiers)}
        </Route>,
        <Route key="internalFiller" path="/internal/monitoringUnit/infrastructureMetrics/filler">
          {wrapInInternalView(FillerInfrastructureMetrics)}
        </Route>,
        <Route key="internalHubforce" path="/internal/monitoringUnit/hubforce">
          {wrapInInternalView(Hubforce)}
        </Route>
      ]
    : [];
  internalRoutes.push(
    <Route key="internalFeatureFlags" path="/internal/featureflags">
      <FeatureFlags />
    </Route>,

    <Route key="internalSyntheticAcceptor" path="/internal/monitoringUnit/synthetics/SyntheticAcceptor">
      {wrapInInternalView(SyntheticsAcceptor)}
    </Route>,
    <Route key="internalSyntheticsHealthProcessor" path="/internal/monitoringUnit/synthetics/SyntheticsHealthProcessor">
      {wrapInInternalView(SyntheticsHealthProcessor)}
    </Route>,
    <Route key="internalSyntheticsWriter" path="/internal/monitoringUnit/synthetics/SyntheticsWriter">
      {wrapInInternalView(SyntheticsWriter)}
    </Route>,
    <Route key="internalSyntheticsReader" path="/internal/monitoringUnit/synthetics/SyntheticsReader">
      {wrapInInternalView(SyntheticsReader)}
    </Route>,
    <Route key="internalEntityStatistics" path="/internal/thisUnit/entityStatistics" component={EntityStatistics} />,
    <Route
      key="internalBytesIngestedStatistics"
      path="/internal/thisUnit/bytesIngestedStatistics"
      component={BytesIngestedStatistics}
    />,
    <Route key="internalGraphExplorer" path="/internal/thisUnit/graphExplorer">
      {wrapInInternalView(GraphExplorer)}
    </Route>,
    <Route key="internalSnapshotVersions" path="/internal/thisUnit/snapshotVersions">
      {wrapInInternalView(SnapshotVersions)}
    </Route>,
    <Route key="internalEvents" path="/internal/thisUnit/internalEvents">
      {wrapInInternalView(InternalEvents)}
    </Route>,
    <Route key="internalMetrics" path="/internal/thisUnit/metrics">
      {wrapInInternalView(Metrics)}
    </Route>,
    <Route key="internalAgents" path="/internal/thisUnit/agents" component={Agents} />,
    <Route key="internalWsApiTester" path="/internal/thisUnit/wsApiTester">
      {wrapInInternalView(WsApiTester)}
    </Route>,
    <Route key="internalAdaptiveBaselineMode" path="/internal/thisUnit/adaptiveBaselineModel">
      {wrapInInternalView(AdaptiveBaselineModel)}
    </Route>,
    <Route key="internalEumComponentMetrics" path="/internal/thisUnit/eum" component={EumComponentMetrics} />,
    <Route key="internalLanding" exact path="/internal">
      {wrapInInternalView(Landing)}
    </Route>,
    <Route key="internalTagProcessorState" path="/internal/thisUnit/tagProcessorState">
      {wrapInInternalView(TagProcessorState)}
    </Route>,
    <Route key="internalTagSets" path="/internal/thisUnit/tagSets">
      {wrapInInternalView(TagSets)}
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
