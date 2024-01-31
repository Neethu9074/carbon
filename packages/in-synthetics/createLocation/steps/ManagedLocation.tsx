/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button, Link, Stack, Typography } from '@instana/components';
import { Result, SyntheticDatacenter } from '@instana/types';
import { Observable } from '@instana/observables';

// eslint-disable-next-line no-restricted-imports
import List, { ColumnDefinition } from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { getDatacenters } from 'in-synthetics/api';
import { Trans, t } from 'in-i18n';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

interface SyntheticDatacenterProps extends SyntheticDatacenter {
  provider?: string;
}

const ManagedLocation = () => {
  const popDocsUrl = 'https://ibm.biz/pop_deployment';

  const datacenters: Observable<SyntheticDatacenterProps[]> = getDatacenters()
    .map(result => {
      return (result as Result<SyntheticDatacenterProps[]>)?.data;
    })
    .map(result => result ?? ([] as SyntheticDatacenterProps[]));

  return (
    <div className={locals.wrapper}>
      <Stack gap="large">
        <div>
          <Typography variant="heading-200">
            {t('in-synthetics:dialog.createLocation.managedLocation.managedDatacentersLabel')}
          </Typography>
          <Typography variant={'body-regular'}>
            <Trans
              i18nKey="in-synthetics:dialog.createLocation.managedLocation.datacentersSubtitle"
              components={{
                // @ts-expect-error property children missing
                linkDatacenters: <Link href={popDocsUrl} external />
              }}
            />
          </Typography>
        </div>
        <List<SyntheticDatacenterProps>
          getHeader={() => null}
          columnDefinitions={columnDefinitions}
          loadEntities={() => datacenters}
          renderNoDataAvailable={() => (
            <NoDataAvailable
              type="lib_synthetic"
              height={160}
              text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Datacenters' })}
            />
          )}
          isSearchable={false}
          pageSize={20}
          initialOrderBy="datacenter_code"
        />
      </Stack>
    </div>
  );
};

const columnDefinitions: Array<ColumnDefinition<SyntheticDatacenterProps>> = [
  {
    id: 'datacenter_code',
    label: t('in-synthetics:dialog.createLocation.managedLocation.datacenterCode'),
    headCellProps: {
      className: locals.label
    },
    cellClassName: locals.label,
    defaultOrderDirection: 'DESC',
    getContent(entity: SyntheticDatacenterProps) {
      return <span className={locals.label}>{entity.code}</span>;
    }
  },
  {
    id: 'datacenter_name',
    label: t('in-synthetics:dialog.createLocation.managedLocation.datacenterName'),
    headCellProps: {
      className: locals.label
    },
    cellClassName: locals.label,
    defaultOrderDirection: 'ASC',
    getContent(entity: SyntheticDatacenterProps) {
      return <span className={locals.label}>{entity.label}</span>;
    }
  },
  {
    id: 'provider',
    label: t('in-synthetics:dialog.createLocation.managedLocation.provider'),
    headCellProps: {
      className: locals.label
    },
    cellClassName: locals.label,
    defaultOrderDirection: 'ASC',
    getContent() {
      return <span className={locals.label}>{'AWS'}</span>;
    }
  },
  {
    id: 'status',
    label: t('in-synthetics:dialog.createLocation.managedLocation.status'),
    headCellProps: {
      className: locals.label
    },
    cellClassName: locals.label,
    defaultOrderDirection: 'ASC',
    getContent(entity: SyntheticDatacenterProps) {
      return <span className={locals.label}>{entity.status}</span>;
    }
  },
  {
    id: 'action',
    label: '',
    sortable: false,
    cellClassName: locals.action,
    getContent(entity: SyntheticDatacenterProps) {
      return (
        <Button disabled={entity.status === 'Active' ? true : false} kind="primary">
          {entity.status === 'Active'
            ? t('in-synthetics:dialog.createLocation.managedLocation.ActivatedButtonLabel')
            : t('in-synthetics:dialog.createLocation.managedLocation.ActivateButtonLabel')}
        </Button>
      );
    }
  }
];

export default ManagedLocation;
