/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

// @ts-expect-error TS migration
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
// @ts-expect-error TS migration
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator/KubernetesIndicator';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
// @ts-expect-error TS migration
import EntityVersionList from 'in-components/EntityVersionList';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
// @ts-expect-error TS migration
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
// @ts-expect-error TS migration
import { NodeBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import getOtelKubernetesNode from 'in-kubernetes/subscriptions/getOtelKubernetesNode';
import { nodeDashboard, nodeOtelDashboard } from 'in-kubernetes/navigation/paths';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import { nodeId as matrixNodeId } from 'in-kubernetes/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import tabs from 'in-kubernetes/Dashboards/Node/tabs/otelIndex';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { pageNames } from 'in-services/tracking/pageNames';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function OtelNodeDashboard({ location }: { location: any }) {
  const props = {
    nodeId: getMatrixParameter(location, nodeDashboard, matrixNodeId),
    viewPath: nodeOtelDashboard,
    timeConfig: getTimeConfig(location)
  };

  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useKubernetesTracker();

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
        renderBreadcrumbs={(clusterId: string) => (
          <Breadcrumbs
            items={NodeBreadcrumbs({
              ...props,
              clusterId
            })}
          />
        )}
      />

      <TabView
        result$={getOtelKubernetesNode({
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

interface HeaderProps {
  result: any;
  kubernetesTimeShiftSelectTracker: (args: any) => void;
  [key: string]: any;
};

function Header(props: HeaderProps) {
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

interface RenderButtonLineProps {
  nodeId: string;
  timeConfig: any;
  result: {
    data?: {
      name?: string;
      clusterId?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
};

function renderButtonLine({ nodeId, timeConfig, result }: RenderButtonLineProps) {
  return (
    <DashboardButtonLine
      snapshotId={nodeId}
      timeConfig={timeConfig}
      plugin={plugins.kubernetesNode}
      tagFilters={[
        {
          name: 'kubernetes.node.name',
          value: result.data?.name,
          operator: 'EQUALS',
          entity: 'DESTINATION',
          type: 'TAG_FILTER'
      },
      {
        name: 'kubernetes.cluster.name',
        value: result.data?.clusterId,
        operator: 'EQUALS',
        entity: 'DESTINATION',
        type: 'TAG_FILTER'
      }
    ]}
    />
  );
}

interface RenderButtonLineSecondaryProps {
  nodeId: string;
  timeConfig: any;
  kubernetesTimeShiftSelectTracker: (args: any) => void;
}

function renderButtonLineSecondary({
  nodeId,
  timeConfig,
  kubernetesTimeShiftSelectTracker
}: RenderButtonLineSecondaryProps) {
  return (
    <>
      {beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled && (
        <TimeShiftDropdown
          disabled={false}
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

function RenderMetaInformation({ result }: { result: any }) {
  const version = get(result, ['data', 'version']);

  return (
    <>
      {version && <BadgeList type={version} types={[version]} getColor={() => 'blue'} />}
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SNode')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
