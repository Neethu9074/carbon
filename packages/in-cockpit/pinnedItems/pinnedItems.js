import { pin as saveItem, unpin as deleteItem, pinnedItems$ } from 'in-cockpit/pinnedItems/pinnedItemsStorageHandler';

export const types = {
  WEBSITES: 'websites',
  APPLCATIONS: 'applications',
  HOSTS: 'hosts',
  CONTAINERS: 'containers',
  PROCESSES: 'processes',
  MOBILE_APPS: 'mobileApplications',
  KUBERNETES_CLUSTERS: 'kubernetesCluster',
  PCF_APPLICATIONS: 'pcfApplications',
  VSPHERE_DATACENTERS: 'vpshereDatacenters'
};

export function getPinnedItems(itemTypes) {
  return pinnedItems$.map(items => {
    const ids = {};
    itemTypes.forEach(type => (ids[type] = items[type] || []));
    return ids;
  });
}

export function pin(type, id) {
  saveItem(type, id);
}

export function unpin(type, id) {
  deleteItem(type, id);
}
