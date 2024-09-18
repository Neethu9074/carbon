/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { themes } from '@instana/design-tokens';

import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator/KubernetesIndicator';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import getKubernetesNode from 'in-kubernetes/subscriptions/getKubernetesNode';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import { nodeId as matrixNodeId } from 'in-kubernetes/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { nodeDashboard } from 'in-kubernetes/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { NodeBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Node/tabs/index';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { pageNames } from 'in-services/tracking/pageNames';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { useSegmentTracker } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function NodeDashboard({ location }) {
  const props = {
    nodeId: getMatrixParameter(location, nodeDashboard, matrixNodeId),
    viewPath: nodeDashboard,
    timeConfig: getTimeConfig(location)
  };

  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useSegmentTracker();

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.node_summary
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
        HeaderComponent={props => (
          <Header {...props} kubernetesTimeShiftSelectTracker={kubernetesTimeShiftSelectTracker} />
        )}
        location={location}
        tabs={tabs}
        tabChangeTracker={e => {
          k8sTabChange({
            ...e,
            dashboard: 'node',
            path: location.pathname
          });
        }}
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
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={RenderMetaInformation}
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

function renderButtonLineSecondary({ nodeId, timeConfig, kubernetesTimeShiftSelectTracker }) {
  return (
    <>
      {beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled && (
        <TimeShiftDropdown
          onChange={offset =>
            kubernetesTimeShiftSelectTracker({
              area: 'node',
              offset: getTimeShiftLabel({ offset: offset }),
              windowSize: timeConfig.windowSize,
              autoRefresh: timeConfig.autoRefresh
            })
          }
        />
      )}
      <RenderButtonLineSecondary timeConfig={timeConfig} snapshotId={nodeId} />
    </>
  );
}

function RenderMetaInformation({ result }) {
  const version = get(result, ['data', 'version']);

  return (
    <>
      {version && <BadgeList type={version} getColor={() => themes.default.ids.color.option.neutral['700']} />}
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SNode')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
