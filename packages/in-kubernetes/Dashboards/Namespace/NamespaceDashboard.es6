import React, { Fragment } from 'react';
import { get } from 'lodash';

import ErroneousEntityVersionList from 'in-kubernetes/Dashboards/commonComponents/ErroneousEntityVersionList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { namespaceId as matrixNamespaceId } from 'in-kubernetes/navigation/matrix';
import BetaMarker, { KubernetesBetaMarker } from 'in-new-components/BetaMarker';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { namespaceDashboard } from 'in-kubernetes/navigation/paths';
import { NamespaceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Namespace/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';

export default function NamespaceDashboard({ location }) {
  const props = {
    namespaceId: getMatrixParameter(location, namespaceDashboard, matrixNamespaceId),
    viewPath: namespaceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        namespaceId={props.namespaceId}
        renderBreadcrumbs={clusterId => (
          <Breadcrumbs
            items={NamespaceBreadcrumbs({
              ...props,
              clusterId,
              namespaceId: props.namespaceId
            })}
          />
        )}
      />

      <TabView
        result$={getKubernetesNamespace({
          id: props.namespaceId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        renderErrors={errors => (
          <ErroneousEntityVersionList snapshotId={props.namespaceId} timeConfig={props.timeConfig} errors={errors} />
        )}
      />
      <BetaMarker title="Tech Preview">{KubernetesBetaMarker}</BetaMarker>
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Namespace"
      icon="lib_kubernetes_namespace"
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}

function Actions({ namespaceId, timeConfig, result }) {
  return (
    <Fragment>
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'clusterName'])}
        namespaceName={get(result, ['data', 'label'])}
        groupByTag={{ name: 'kubernetes.service.name' }}
        timeConfig={timeConfig}
      />
      <EntityHealthIndicator
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={namespaceId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Namespace" />
      <KubernetesIndicator result={result} />
    </Fragment>
  );
}
