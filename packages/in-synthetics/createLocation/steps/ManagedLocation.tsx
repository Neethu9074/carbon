/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Link, Stack, Typography } from '@instana/components';
import { Result, SyntheticDatacenter } from '@instana/types';
import { Observable } from '@instana/observables';

// eslint-disable-next-line no-restricted-imports
import List, { ColumnDefinition } from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { getDatacenters } from 'in-synthetics/api';
import { Trans, t } from 'in-i18n';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

interface SyntheticDatacenterProps extends SyntheticDatacenter {
  provider: string;
}

interface ManagedLocationProps {
  selectedDatacenter: string;
  setSelectedDatacenter: React.Dispatch<React.SetStateAction<string>>;
}

const ManagedLocation = ({ selectedDatacenter, setSelectedDatacenter }: ManagedLocationProps) => {
  const popDocsUrl = 'https://ibm.biz/pop_deployment';

  const datacenters: Observable<SyntheticDatacenterProps[]> = getDatacenters({})
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
          columnDefinitions={getColumnDefinitions(selectedDatacenter, setSelectedDatacenter)}
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

function getColumnDefinitions(
  selectedDatacenter: string,
  setSelectedDatacenter: React.Dispatch<React.SetStateAction<string>>
): Array<ColumnDefinition<SyntheticDatacenterProps>> {
  const severity: Record<string, number> = { Active: 0, Pending: 5, Failure: 10 };
  return [
    {
      id: 'datacenter_code',
      label: t('in-synthetics:dialog.createLocation.managedLocation.datacenterCode'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenterProps) {
        return (
          <CheckboxFancy
            asRadioButton
            label={entity.code}
            checked={selectedDatacenter === entity.code}
            onChange={() => setSelectedDatacenter(selectedDatacenter === entity.code ? '' : entity.code!)}
            disabled={entity.status !== 'Inactive'}
          />
        );
      }
    },
    {
      id: 'datacenter_name',
      label: t('in-synthetics:dialog.createLocation.managedLocation.datacenterName'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenterProps) {
        return <span className={locals.label}>{entity.label}</span>;
      }
    },
    {
      id: 'provider',
      label: t('in-synthetics:dialog.createLocation.managedLocation.provider'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenterProps) {
        return <span className={locals.label}>{entity.provider}</span>;
      }
    },
    {
      id: 'status',
      label: t('in-synthetics:dialog.createLocation.managedLocation.status'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenterProps) {
        return (
          <div className={locals.entityWrapper}>
            <HealthDot
              className={classNames({ [locals.dot]: true, [locals.inactive]: entity.status === 'Inactive' })}
              severity={entity.status ? severity[entity.status] : undefined}
              iconSize={8}
            />
            <span>{entity.status}</span>
          </div>
        );
      }
    }
  ];
}

export default ManagedLocation;
