import { get } from 'lodash';
import React from 'react';

import { getDeploymentDashboard, getDeploymentConfigDashboard, summaryTab } from 'in-kubernetes/navigation/paths';
import getOpenShiftDeploymentConfigs from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import ButtonGroup from 'in-new-components/ButtonGroup';
import useUrlState from 'in-hooks/useUrlState';

const tabDeployments = 'deployments';
const tabDeploymentConfigs = 'deploymentConfigs';

export default function TopDeploymentsList(props) {
  const urlStateDefinition = {
    bind: [
      {
        path: summaryTab,
        name: 'deploymentsTab'
      }
    ]
  };
  const [{ deploymentsTab }, setUrlState] = useUrlState(urlStateDefinition);
  const selectedTab = deploymentsTab ?? tabDeployments;
  const setSelectedTab = tab => setUrlState({ deploymentsTab: tab });

  return (
    <KubernetesTopList
      title="Top Deployments"
      viewAllEntityName={selectedTab === tabDeployments ? 'deployment' : 'deployment config'}
      {...props}
      header={header({
        showDeploymentConfigs: props.showDeploymentConfigs,
        selectedTab: selectedTab,
        setSelectedTab: setSelectedTab
      })}
      getItems={_props =>
        selectedTab === tabDeployments ? getKubernetesDeployments(_props) : getOpenShiftDeploymentConfigs(_props)
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
      allItemsHref$={props.allItemsHrefs$[selectedTab]}
      getItemLabel={item => get(item, ['deployment'], get(item, ['deploymentConfig'])).name}
    />
  );
}

function header({ showDeploymentConfigs, selectedTab, setSelectedTab }) {
  return (
    showDeploymentConfigs && (
      <ButtonGroup
        buttonPropsList={[
          {
            text: 'Deployments',
            key: tabDeployments,
            onClick: () => setSelectedTab(tabDeployments)
          },
          {
            text: 'Deployment Configs',
            key: tabDeploymentConfigs,
            onClick: () => setSelectedTab(tabDeploymentConfigs)
          }
        ]}
        activeKey={selectedTab}
      />
    )
  );
}
