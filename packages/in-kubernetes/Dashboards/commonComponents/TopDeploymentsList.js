/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import { t } from 'in-i18n';
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
      title={t('in-kubernetes:dashboards.topDeployments')}
      entityNameKey={selectedTab === tabDeployments ? 'deployment' : 'deploymentConfig'}
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
            text: t('in-kubernetes:dashboards.deployments'),
            key: tabDeployments,
            onClick: () => setSelectedTab(tabDeployments)
          },
          {
            text: t('in-kubernetes:dashboards.deploymentConfigs'),
            key: tabDeploymentConfigs,
            onClick: () => setSelectedTab(tabDeploymentConfigs)
          }
        ]}
        activeKey={selectedTab}
      />
    )
  );
}
