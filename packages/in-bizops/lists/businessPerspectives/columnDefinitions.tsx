/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { BusinessPerspectiveItem, TimeConfig } from '@instana/types';

import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { t } from 'in-i18n';

interface bpListProps extends ServerTablePresenterProps<BusinessPerspectiveItem> {
  timeConfig: TimeConfig;
}

function BusinessPerspectiveNameColumnContent(item: BusinessPerspectiveItem) {
  return item.businessPerspective.label;
}

export const perspectiveColumnDefinitions: ColumnDefinition<BusinessPerspectiveItem, bpListProps>[] = [
  {
    id: 'perspective_name',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.nameLabel'),
    getContent: BusinessPerspectiveNameColumnContent
  }
];
