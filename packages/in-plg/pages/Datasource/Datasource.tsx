/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import OTelCollector from 'in-plg/pages/Datasource/OTelCollector/OTelCollector';
import { SelectedDatasource, datasourceTypes } from 'in-plg/navigation/paths';
import InstanaAgent from 'in-plg/pages/Datasource/InstanaAgent/InstanaAgent';
import DatasourceHeader from 'in-plg/pages/Datasource/DatasourceHeader';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { pageNames } from 'in-services/tracking/pageNames';

interface DatasourceProps {
  selectedDatasource: SelectedDatasource;
  agentSnapshotsResult: SnapshotData;
}

const Datasource = ({ selectedDatasource, agentSnapshotsResult }: DatasourceProps) => {
  let PageToBeRendered = <></>;
  let pageRootName;

  if (selectedDatasource === datasourceTypes.instana_agent) {
    PageToBeRendered = <InstanaAgent agentSnapshotsResult={agentSnapshotsResult} />;
    pageRootName = pageNames.agents;
  } else if (selectedDatasource === datasourceTypes.otel_collector) {
    PageToBeRendered = <OTelCollector />;
    pageRootName = pageNames.otel_collector;
  }

  return (
    <>
      <DatasourceHeader />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.data_sources,
          pageRootName
        }}
      />
      {PageToBeRendered}
    </>
  );
};

export default Datasource;
