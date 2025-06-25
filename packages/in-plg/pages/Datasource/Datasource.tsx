/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import OTelCollector from 'in-plg/pages/Datasource/OTelCollector/OTelCollector';
import { SelectedDatasource, datasourceTypes } from 'in-plg/navigation/paths';
import InstanaAgent from 'in-plg/pages/Datasource/InstanaAgent/InstanaAgent';
import DatasourceHeader from 'in-plg/pages/Datasource/DatasourceHeader';
import { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';

interface DatasourceProps {
  selectedDatasource: SelectedDatasource;
  agentSnapshotsResult: OUT | null | undefined;
}

const Datasource = ({ selectedDatasource, agentSnapshotsResult }: DatasourceProps) => {
  let PageToBeRendered = <></>;

  if (selectedDatasource === datasourceTypes.instana_agent) {
    PageToBeRendered = <InstanaAgent agentSnapshotsResult={agentSnapshotsResult} />;
  } else if (selectedDatasource === datasourceTypes.otel_collector) {
    PageToBeRendered = <OTelCollector />;
  }

  return (
    <>
      <DatasourceHeader />
      {PageToBeRendered}
    </>
  );
};

export default Datasource;
