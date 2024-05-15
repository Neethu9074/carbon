/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { BusinessProcessItem, TimeConfig } from '@instana/types';

import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { t } from 'in-i18n';

/* TODO: Use this when backend is available
interface BusinessPerspectiveItem {
  perspectiveName: string;
  perspectiveId: string;
}
*/

interface bpListProps extends ServerTablePresenterProps<BusinessProcessItem> {
  timeConfig: TimeConfig;
}

function BusinessPerspectiveNameColumnContent(item: BusinessProcessItem) {
  return item.businessProcess.definitionName;
}

export const perspectiveColumnDefinitions: ColumnDefinition<BusinessProcessItem, bpListProps>[] = [
  {
    id: 'process_name',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.nameLabel'),
    getContent: BusinessPerspectiveNameColumnContent
  }
];
