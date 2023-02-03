/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { selectedType$, setSelectedType, matchedSnapshotCount$ } from 'in-infrastructure/tableView/stores/snapshotIds';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './TypeSelector.less';

const block = 'in-table-view-type-selector';
const id = 'table-view-type-selector';

const physicalDomains = {
  beeInstanaNode: t('in-infrastructure:tableView.physicalDomains.beeInstanaNode'),
  clickHouseDatabase: t('in-infrastructure:tableView.physicalDomains.clickHouseDatabase'),
  containerd: t('in-infrastructure:tableView.physicalDomains.containerd'),
  crio: t('in-infrastructure:tableView.physicalDomains.crio'),
  crowdStrikeFalcon: t('in-infrastructure:tableView.physicalDomains.crowdStrikeFalcon'),
  docker: t('in-infrastructure:tableView.physicalDomains.docker'),
  garden: t('in-infrastructure:tableView.physicalDomains.garden'),
  host: t('in-infrastructure:tableView.physicalDomains.host'),
  jvm: t('in-infrastructure:tableView.physicalDomains.jvm'),
  lxc: t('in-infrastructure:tableView.physicalDomains.lxc'),
  nodejs: t('in-infrastructure:tableView.physicalDomains.nodejs'),
  ping: t('in-infrastructure:tableView.physicalDomains.ping'),
  process: t('in-infrastructure:tableView.physicalDomains.process')
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
