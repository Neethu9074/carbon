import { withState } from 'recompose';
import { get } from 'lodash';
import React from 'react';

import getOpenShiftDeploymentConfigs from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import { getDeploymentDashboard, getDeploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import ButtonGroup from 'in-new-components/ButtonGroup';

export default withState('selectedView', 'setSelectedView', 'deployments')(TopDeploymentsList);

function TopDeploymentsList(props) {
  return (
    <KubernetesTopList
      title="Top Deployments"
      viewAllEntityName={props.selectedView === 'deployments' ? 'deployment' : 'deployment config'}
      {...props}
      header={header(props)}
      getItems={_props =>
        props.selectedView === 'deployments' ? getKubernetesDeployments(_props) : getOpenShiftDeploymentConfigs(_props)
      }
      getItemHref$={item =>
        get(item, ['deployment'])
          ? getDeploymentDashboard(item.deployment.id, {
              clusterId: props.clusterId,
              namespaceId: props.namespaceId
            })
          : getDeploymentConfigDashboard(item.deploymentConfig.id, {
              clusterId: props.clusterId,
              namespaceId: props.namespaceId
            })
      }
      allItemsHref$={props.allItemsHrefs$[props.selectedView]}
      getItemLabel={item => get(item, ['deployment'], get(item, ['deploymentConfig'])).name}
    />
  );
}

function header(props) {
  return (
    props.showDeploymentConfigs && (
      <ButtonGroup
        buttonPropsList={[
          {
            text: 'Deployments',
            key: 'deployments',
            onClick: () => props.setSelectedView('deployments')
          },
          {
            text: 'Deployment Configs',
            key: 'deploymentConfigs',
            onClick: () => props.setSelectedView('deploymentConfigs')
          }
        ]}
        activeKey={props.selectedView}
      />
    )
  );
}
