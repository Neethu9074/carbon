/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonDropdown, CarbonButton, SvgIcon } from '@instana/components';
import { Order } from '@instana/types';

import {
  name,
  unhealthyNodes,
  unhealthyDeployments,
  runningPods,
  namespaces,
  cronJobs,
  services
} from 'in-kubernetes/utils';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

import locals from './SortingConfigurator.mless';

type OnChangeType = {
  (event: { selectedItem: DropdownItem }): void;
  (event: React.MouseEvent<HTMLButtonElement>): void;
};

type DropdownItem = { value: string; label: string };

export const options: DropdownItem[] = deepFreeze([
  { label: t('in-kubernetes:cloudNative.sortingOptions.name'), value: name },
  { label: t('in-kubernetes:cloudNative.sortingOptions.unhealthyNodes'), value: unhealthyNodes },
  { label: t('in-kubernetes:cloudNative.sortingOptions.unhealthyDeployments'), value: unhealthyDeployments },
  { label: t('in-kubernetes:cloudNative.sortingOptions.runningPods'), value: runningPods },
  { label: t('in-kubernetes:cloudNative.sortingOptions.namespaces'), value: namespaces },
  { label: t('in-kubernetes:cloudNative.sortingOptions.cronJobs'), value: cronJobs },
  { label: t('in-kubernetes:cloudNative.sortingOptions.services'), value: services }
]);

interface SortingConfiguratorProps {
  onChange: OnChangeType;
  order: Order;
}

export default function SortingConfigurator({ onChange, order }: Readonly<SortingConfiguratorProps>) {
  const selectedItem = options.find(item => item.value === order.by) ?? options[0];
  return (
    <div className={locals.sortingConfigurator}>
      <CarbonDropdown
        id="sorting-configurator"
        type="inline"
        items={options}
        aria-label={`${t('in-kubernetes:cloudNative.sortingOptions.sortBy')}: ${selectedItem.label}`}
        label={t('in-kubernetes:cloudNative.sortingOptions.sortBy')}
        titleText={t('in-kubernetes:cloudNative.sortingOptions.sortBy')}
        initialSelectedItem={selectedItem}
        onChange={onChange}
      />
      <CarbonButton
        className={locals.button}
        aria-label={`${t('in-kubernetes:cloudNative.sortingOptions.sortOrder')}: ${order.by}`}
        onClick={onChange}
        kind="ghost"
        renderIcon={() => (
          <SvgIcon
            type={order.direction === 'ASC' ? 'lib_actions_sort_ascending' : 'lib_actions_sort_descending'}
            color="currentColor"
            size="s"
          />
        )}
      >
        {order.direction === 'ASC'
          ? t('in-components:sortingConfigurator.buttonAscending')
          : t('in-components:sortingConfigurator.buttonDescending')}
      </CarbonButton>
    </div>
  );
}
