import React, { useState } from 'react';

import {
  mapApplications,
  mapKubernetesClusters,
  mapKubernetesNamespaces,
  mapWebsites,
  mapMobileApps,
  mapInfraDfq
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import { iconColumn, labelColumn } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaColumnDefinitions';
import { getKubernetesNamespacesAsResultObservable } from 'in-settings/tabs/TeamSettings/api/kubernetesNamespaces';
import AreasTabControl from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/AreasTabControl';
import { getKubernetesClustersAsResultObservable } from 'in-settings/tabs/TeamSettings/api/kubernetesClusters';
import K8sNamespaces from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/K8sNamespaces';
import Applications from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Applications';
import K8sClusters from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/K8sClusters';
import MobileApps from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/MobileApps';
import InfraDFQ from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/InfraDFQ';
import Websites from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Websites';
import { success, combineResultObservables, isLoading, hasError } from 'in-services/util/result';
import { getMobileAppsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/mobileApps';
import { getWebsitesAsResultObservable } from 'in-settings/tabs/TeamSettings/api/websites';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import withSelectableItems from 'in-settings/components/withSelectableItems';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Li, Ul } from 'in-new-components/lists/List';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import { light } from 'in-themes/themes';

import locals from './Areas.mless';

export default connectTo(
  () =>
    combineResultObservables({
      applications: getApplicationConfigsAsResultObservable(),
      K8sClusters: getKubernetesClustersAsResultObservable(),
      K8sNamespaces: getKubernetesNamespacesAsResultObservable(),
      websites: getWebsitesAsResultObservable(),
      mobileApps: getMobileAppsAsResultObservable()
    }),
  function AreasList({ update, result, permissionSet, removeId, removeDfq }) {
    const [page, setPage] = useState(1);

    return (
      <LocallyChangedTheme theme={light}>
        <ListInsideACardRenderer
          itemName="Area"
          page={page}
          setPage={setPage}
          update={update}
          ListRenderer={ListRenderer}
          itemsResult={
            isLoading(result) || hasError(result)
              ? result
              : success(
                  [
                    ...mapApplications(result.applications, permissionSet.applicationIds, id => ({
                      delete: () => removeId(id, 'applicationIds')
                    })),
                    ...mapKubernetesClusters(result.K8sClusters, permissionSet.kubernetesClusterUUIDs, id => ({
                      delete: () => removeId(id, 'kubernetesClusterUUIDs')
                    })),
                    ...mapKubernetesNamespaces(result.K8sNamespaces, permissionSet.kubernetesNamespaceUIDs, id => ({
                      delete: () => removeId(id, 'kubernetesNamespaceUIDs')
                    })),
                    ...mapWebsites(result.websites, permissionSet.websiteIds, id => ({
                      delete: () => removeId(id, 'websiteIds')
                    })),
                    ...mapMobileApps(result.mobileApps, permissionSet.mobileAppIds, id => ({
                      delete: () => removeId(id, 'mobileAppIds')
                    })),
                    ...mapInfraDfq(permissionSet.infraDfqFilter, () => ({
                      delete: removeDfq
                    }))
                  ].filter(Boolean)
                )
          }
          infraDfqFilter={permissionSet.infraDfqFilter}
          renderAdditionalHeaderContent={renderAdditionalHeaderContent}
        />
      </LocallyChangedTheme>
    );
  }
);

function renderAdditionalHeaderContent(props) {
  return <AddAreaButton {...props} ids={props.pageItems.map(({ id }) => id)} />;
}

function ListRenderer({ items }) {
  return (
    <Ul>
      {items.map(item => (
        <Li key={item.id}>
          <ColumnizedContent columnDefinitions={columnDefinitions} item={item} />
        </Li>
      ))}
    </Ul>
  );
}

const columnDefinitions = [
  iconColumn,
  labelColumn,
  {
    width: '2rem',
    getContent({ item }) {
      return <Delete doDelete={item.delete} skipDialog />;
    }
  }
];

function AddAreaButton({ ids, infraDfqFilter, update }) {
  return (
    <Button
      kind="action"
      onClick={() => addActiveDialog(<SelectableDialog ids={ids} update={update} infraDfqFilter={infraDfqFilter} />)}
      icon="lib_openclose_add_circle_outline"
    >
      Add Areas
    </Button>
  );
}

const SelectableDialog = withSelectableItems(function Selectable(props) {
  const { update, selectedEntities, infraDfqFilter } = props;

  const [dfq, setDfq] = useState(infraDfqFilter);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Dialog className={locals.dialog} title="Add areas to group" onClose={close}>
      <form
        onSubmit={() => {
          update(Array.from(selectedEntities.keys()).map(id => ({ id, item: selectedEntities.get(id) })), dfq);
          close();
        }}
      >
        <AreasTabControl activeTabIndex={activeTabIndex} onTabSelect={setActiveTabIndex} />
        <div className={locals.content}>
          {activeTabIndex === 0 && <Applications {...props} />}
          {activeTabIndex === 1 && <K8sClusters {...props} />}
          {activeTabIndex === 2 && <K8sNamespaces {...props} />}
          {activeTabIndex === 3 && <Websites {...props} />}
          {activeTabIndex === 4 && <MobileApps {...props} />}
          {activeTabIndex === 5 && <InfraDFQ setDfq={setDfq} infraDfqFilter={dfq} />}
        </div>

        <Button
          className={locals.button}
          kind="primary"
          type="submit"
          disabled={selectedEntities.size === 0 && dfq === infraDfqFilter}
        >
          Add to group
        </Button>
      </form>
    </Dialog>
  );
});
