import React, { Fragment } from 'react';
import { get } from 'lodash';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { nodeId as matrixNodeId } from 'in-kubernetes/navigation/matrix';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { nodeDashboard } from 'in-kubernetes/navigation/paths';
import { NodeBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Node/tabs/index';
import BadgeList from 'in-new-components/Badge/BadgeList';
import { getTimeConfig } from 'in-stores/time/config';
import { nodeTabChange } from 'in-kubernetes/tracker';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';
import theme from 'in-themes';

export default function NodeDashboard({ location }) {
  const props = {
    nodeId: getMatrixParameter(location, nodeDashboard, matrixNodeId),
    viewPath: nodeDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
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
          <EntityVersionList
            plugin={plugins.kubernetesNode}
            snapshotId={props.nodeId}
            timeConfig={props.timeConfig}
            errors={errors}
          />
        )}
      />

      <Footer />
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Node"
      icon="lib_kubernetes_node"
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
    />
  );
}

function Actions({ nodeId, timeConfig }) {
  return (
    <Fragment>
      <EntityHealthIndicator
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={nodeId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  const version = get(result, ['data', 'version']);

  return (
    <Fragment>
      {version && <BadgeList type={version} getColor={() => theme.lib.colors.N700Medium} />}
      <TypesBadgeList type="K8s Node" />
      <KubernetesIndicator result={result} />
    </Fragment>
  );
}
