import React, { Fragment } from 'react';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import { nodeId as matrixNodeId, clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { nodeDashboard } from 'in-kubernetes/navigation/paths';
import { NodeBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Node/tabs/index';
import BetaMarker from 'in-new-components/BetaMarker';
import { getTimeConfig } from 'in-stores/time/config';
import Button from 'in-new-components/Button';

export default function NodeDashboard({ location }) {
  const props = {
    nodeId: getMatrixParameter(location, nodeDashboard, matrixNodeId),
    viewPath: nodeDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs
        items={NodeBreadcrumbs({ ...props, clusterId: getMatrixParameter(location, nodeDashboard, matrixClusterId) })}
      />
      <TabView
        result$={getKubernetesNode({
          id: props.nodeId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
      <BetaMarker title="Tech Preview">
        <p>
          You are looking at the new Kubernetes support from Instana, which is currently in a Tech Preview. Please get
          in touch with us for any questions and feedback
        </p>
        <Button kind="primaryv2" href="mailto:matthias.luebken@instana.com?subject=Feedback on Kubernetes support">
          Provide Feedback
        </Button>
      </BetaMarker>
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
      <KubernetesEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        nodeId={nodeId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes() {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Node" />
      <KubernetesIndicator />
    </Fragment>
  );
}
