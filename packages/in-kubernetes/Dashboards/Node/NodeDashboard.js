/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import { nodeId as matrixNodeId } from 'in-kubernetes/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { nodeDashboard } from 'in-kubernetes/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { NodeBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Node/tabs/index';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { getTimeConfig } from 'in-stores/time/config';
import { nodeTabChange } from 'in-kubernetes/tracker';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function NodeDashboard({ location }) {
  const props = {
    nodeId: getMatrixParameter(location, nodeDashboard, matrixNodeId),
    viewPath: nodeDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Kubernetes',
          pageRootName: t('in-kubernetes:kubernetesPageRootName', {
            objectType: t('in-kubernetes:dashboards.node')
          })
        }}
      />

      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        nodeId={props.nodeId}
        renderBreadcrumbs={clusterId => (
          <Breadcrumbs
            items={NodeBreadcrumbs({
              ...props,
              clusterId
            })}
          />
        )}
      />

      <TabView
        result$={getKubernetesNode({
          id: props.nodeId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={nodeTabChange}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesNode}
              snapshotId={props.nodeId}
              timeConfig={props.timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />

      <Footer />
    </>
  );
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-kubernetes:dashboards.kubernetesNode')}
      icon="lib_kubernetes_node"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ nodeId, timeConfig, result }) {
  return (
    <DashboardButtonLine
      snapshotId={nodeId}
      timeConfig={timeConfig}
      plugin={plugins.kubernetesNode}
      tagFilters={[
        { name: 'kubernetes.node.name', value: result.data?.name, operator: 'EQUALS' },
        { name: 'kubernetes.cluster.name', value: result.data?.clusterId, operator: 'EQUALS', entity: 'DESTINATION' }
      ]}
    />
  );
}

function renderMetaInformation({ result }) {
  const version = get(result, ['data', 'version']);

  return (
    <>
      {version && <BadgeList type={version} getColor={() => theme.lib.colors.N700Medium} />}
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SNode')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
