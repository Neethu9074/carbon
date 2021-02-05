/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { selectedType$, setSelectedType, matchedSnapshotCount$ } from 'in-infrastructure/tableView/stores/snapshotIds';
import connectTo from 'in-hoc/connectTo';

import './TypeSelector.less';

const block = 'in-table-view-type-selector';
const id = 'table-view-type-selector';

const physicalDomains = {
  host: t('in-infrastructure:tableView.physicalDomains.host'),
  jvm: t('in-infrastructure:tableView.physicalDomains.jvm'),
  nodejs: t('in-infrastructure:tableView.physicalDomains.nodejs'),
  containerd: t('in-infrastructure:tableView.physicalDomains.containerd'),
  crio: t('in-infrastructure:tableView.physicalDomains.crio'),
  docker: t('in-infrastructure:tableView.physicalDomains.docker'),
  garden: t('in-infrastructure:tableView.physicalDomains.garden'),
  lxc: t('in-infrastructure:tableView.physicalDomains.lxc'),
  process: t('in-infrastructure:tableView.physicalDomains.process'),
  clickHouseDatabase: t('in-infrastructure:tableView.physicalDomains.clickHouseDatabase'),
  ping: t('in-infrastructure:tableView.physicalDomains.ping')
};

export default connectTo(
  {
    selectedType: selectedType$.map(selectedType => selectedType.type),
    matchedSnapshotCount: matchedSnapshotCount$
  },
  function TypeSelector({ selectedType, matchedSnapshotCount }) {
    return (
      <label className={block} htmlFor={id}>
        {t('in-infrastructure:tableView.tableContent')}
        <select id={id} className={`${block}__selection`} value={selectedType} onChange={setType}>
          {Object.keys(physicalDomains)
            .sort()
            .map(val => (
              <option value={val} key={val}>
                {physicalDomains[val]}
              </option>
            ))}
        </select>
        ({matchedSnapshotCount})
      </label>
    );
  }
);

function setType(e) {
  setSelectedType(e.target.value);
}
