/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';
import { Button } from '@instana/components';

import {
  mapApplications,
  mapKubernetesClusters,
  mapKubernetesNamespaces,
  mapWebsites,
  mapMobileApps,
  mapInfraDfq
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import { iconColumn, labelColumn } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/AreaColumnDefinitions';
import AreasTabControl from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/AreasTabControl';
import K8sNamespaces from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/K8sNamespaces';
import Applications from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Applications';
import K8sClusters from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/K8sClusters';
import MobileApps from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/MobileApps';
import InfraDFQ from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/InfraDFQ';
import Websites from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Websites';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import withSelectableItems from 'in-settings/components/withSelectableItems';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { success } from 'in-services/util/result';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './Areas.mless';

export default function Areas({ update, permissionSet, removeId, removeDfq, readOnly }) {
  const [page, setPage] = useState(1);

  return (
    <ListInsideACardRenderer
      itemName="Area"
      page={page}
      setPage={setPage}
      update={update}
      ListRenderer={readOnly ? ReadOnlyListRenderer : ListRenderer}
      itemsResult={success(
        [
          ...mapApplications(permissionSet.applicationIds, id => ({
            delete: () => removeId(id, 'applicationIds')
          })),
          ...mapKubernetesClusters(permissionSet.kubernetesClusterUUIDs, id => ({
            delete: () => removeId(id, 'kubernetesClusterUUIDs')
          })),
          ...mapKubernetesNamespaces(permissionSet.kubernetesNamespaceUIDs, id => ({
            delete: () => removeId(id, 'kubernetesNamespaceUIDs')
          })),
          ...mapWebsites(permissionSet.websiteIds, id => ({
            delete: () => removeId(id, 'websiteIds')
          })),
          ...mapMobileApps(permissionSet.mobileAppIds, id => ({
            delete: () => removeId(id, 'mobileAppIds')
          })),
          mapInfraDfq(permissionSet.infraDfqFilter, () => ({
            delete: removeDfq
          }))
        ].filter(Boolean)
      )}
      infraDfqFilter={permissionSet.infraDfqFilter}
      renderAdditionalHeaderContent={readOnly ? null : renderAdditionalHeaderContent}
    />
  );
}

function renderAdditionalHeaderContent(props) {
  return <AddAreaButton {...props} preSelectedItems={props.itemsResult.data} />;
}

function ReadOnlyListRenderer({ items }) {
  return (
    <Ul>
      {items.map(item => (
        <Li key={item.id}>
          <ColumnizedContent columnDefinitions={[iconColumn, labelColumn]} item={item} />
        </Li>
      ))}
    </Ul>
  );
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

function AddAreaButton({ preSelectedItems, infraDfqFilter, update }) {
  return (
    <Button
      kind="action"
      onClick={() =>
        addActiveDialog(
          <SelectableDialog preSelectedItems={preSelectedItems} update={update} infraDfqFilter={infraDfqFilter} />
        )
      }
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-settings:tabs.addAreasButton')}
    </Button>
  );
}

const SelectableDialog = withSelectableItems(function Selectable(props) {
  const { update, selectedEntities, infraDfqFilter } = props;

  const [dfq, setDfq] = useState(infraDfqFilter.scopeId);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Dialog className={locals.dialog} title={t('in-settings:tabs.addAreasToGroup')} onClose={close}>
      <form
        onSubmit={() => {
          update(
            Array.from(selectedEntities.keys()).map(id => ({ id, type: selectedEntities.get(id) })),
            dfq
          );
          close();
        }}
      >
        <AreasTabControl activeTabIndex={activeTabIndex} onTabSelect={setActiveTabIndex} />
        <div className={locals.content}>
          {activeTabIndex === 0 && <Websites {...props} />}
          {activeTabIndex === 1 && <MobileApps {...props} />}
          {activeTabIndex === 2 && <Applications {...props} />}
          {activeTabIndex === 3 && <K8sClusters {...props} />}
          {activeTabIndex === 4 && <K8sNamespaces {...props} />}
          {activeTabIndex === 5 && <InfraDFQ setDfq={setDfq} infraDfqFilter={dfq} />}
        </div>

        <Button
          className={locals.button}
          kind="primary"
          type="submit"
          disabled={selectedEntities.size === 0 && dfq === infraDfqFilter.scopeId}
        >
          {t('in-settings:tabs.addToGroup')}
        </Button>
      </form>
    </Dialog>
  );
});
