/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { ButtonGroup } from '@instana/components';
import { Link } from '@instana/components';

import { useDeploymentDashboard, useDeploymentConfigDashboard, summaryTab } from 'in-kubernetes/navigation/paths';
import getOpenShiftDeploymentConfigs from 'in-kubernetes/subscriptions/getOpenShiftDeploymentConfigs';
import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesDeployments from 'in-kubernetes/subscriptions/getKubernetesDeployments';
import { trackTopListNavigation } from 'in-components/TopListWithUrlState';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

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
  const { clusterId, namespaceId } = props;
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
      Label={item => (
        <Label
          {...item}
          clusterId={clusterId}
          namespaceId={namespaceId}
          entityNameKey={selectedTab === tabDeployments ? 'deployment' : 'deploymentConfig'}
        />
      )}
      allItemsHref={props.allItemsHrefs[selectedTab]}
      getItemLabel={item => get(item, ['deployment'], get(item, ['deploymentConfig'])).name}
    />
  );
}

function header({ showDeploymentConfigs, selectedTab, setSelectedTab }) {
  return (
    showDeploymentConfigs && (
      <ButtonGroup
        id="button-group-top-deployments"
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

function Label({ item, clusterId, namespaceId, getItemLabel, className, entityNameKey }) {
  const deploymentHref = useDeploymentDashboard(item.deployment.id, {
    clusterId,
    namespaceId
  });

  const deploymentConfigHref = useDeploymentConfigDashboard(item.deploymentConfig.id, {
    clusterId: clusterId,
    namespaceId: namespaceId
  });

  return (
    <Link
      className={className}
      href={entityNameKey === 'deployment' ? deploymentHref : deploymentConfigHref}
      onClick={() => trackTopListNavigation()}
    >
      {getItemLabel(item)}
    </Link>
  );
}
