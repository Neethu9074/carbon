/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import { getKubernetesPodsData } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
import { phasePodListUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import PodsTable from 'in-kubernetes/Dashboards/commonComponents/PodsTable';
import podPhases from 'in-kubernetes/podPhases';
import useUrlState from 'in-hooks/useUrlState';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './Pods.mless';

export function PodsWithNamespaces({ ...props }) {
  return <Pods withNamespaces {...props} />;
}

const urlStateDefinition = {
  bind: [phasePodListUrlParameter]
};

export default function Pods(props) {
  const {
    timeConfig,
    namespaceId,
    clusterId,
    workloadControllerId,
    serviceId,
    leftHeader,
    nodeId,
    cronJobId,
    withNamespaces = false
  } = props;

  const [{ phase }, setPhase] = useUrlState(urlStateDefinition);

  const rightHeader = (
    <ComboBox
      placeholder={t('in-kubernetes:dashboards.placeholderPhase')}
      value={phase}
      isSearchable={false}
      onChange={t => setPhase({ phase: t ? t.value : null })}
      options={podPhases}
      className={locals.filter}
    />
  );

  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="pods" />
      <PodsTable
        get={getKubernetesPodsData}
        timeConfig={timeConfig}
        namespaceId={namespaceId}
        workloadControllerId={workloadControllerId}
        clusterId={clusterId}
        serviceId={serviceId}
        nodeId={nodeId}
        cronJobId={cronJobId}
        rightHeader={rightHeader}
        leftHeader={leftHeader}
        phase={phase}
        withNamespaces={withNamespaces}
      />
    </>
  );
}
