/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import CredentialAssociationsContent from 'in-synthetics/dashboards/global/tabs/credentials/components/CredentialAssociationsContent';
import CredentialListActionsColumn from 'in-synthetics/dashboards/global/tabs/credentials/components/CredentialListActionsColumn';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { formatDateTime } from 'in-services/formatters/date';
import { SyntheticCredential } from 'in-types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const columnDefinitions: ColumnDefinition<SyntheticCredential>[] = [
  {
    id: 'credentialName',
    defaultOrderDirection: 'ASC',
    label: t('in-synthetics:dashboard.credentialList.name'),
    getContent(item) {
      return <div>{item.credentialName}</div>;
    }
  },
  {
    id: 'associations',
    label: t('in-synthetics:dashboard.credentialList.associations'),
    defaultOrderDirection: 'ASC',
    getContent(item) {
      return <CredentialAssociationsContent item={item} />;
    }
  },
  {
    id: 'createdAt',
    label: t('in-synthetics:dashboard.credentialList.createdAt'),
    defaultOrderDirection: 'ASC',
    getContent(item) {
      return <div>{formatDateTime(item.createdAt)}</div>;
    }
  },
  {
    id: 'createdBy',
    label: t('in-synthetics:dashboard.credentialList.createdBy'),
    defaultOrderDirection: 'ASC',
    getContent(item) {
      return <div>{item.createdBy}</div>;
    }
  },
  {
    id: 'modifiedBy',
    label: t('in-synthetics:dashboard.credentialList.lastModifiedBy'),
    defaultOrderDirection: 'ASC',
    getContent(item) {
      return <div>{item.modifiedBy}</div>;
    }
  }
];
if (role?.canConfigureSyntheticCredentials) {
  columnDefinitions.push({
    id: 'action',
    label: t('in-synthetics:dashboard.credentialList.actions'),
    sortable: false,
    getContent(item) {
      return (
        <HorizontalFlexWrapper>
          <CredentialListActionsColumn item={item} />
        </HorizontalFlexWrapper>
      );
    }
  });
}

export default columnDefinitions;
