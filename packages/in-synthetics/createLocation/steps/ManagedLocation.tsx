/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Link, Stack, Typography, Checkbox } from '@instana/components';
import { SyntheticDatacenter } from '@instana/types';
import { Observable } from '@instana/observables';

// eslint-disable-next-line no-restricted-imports
import List, { ColumnDefinition } from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { datacenterProviderMap } from 'in-synthetics/utils/constants';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { Trans, t } from 'in-i18n';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

interface ManagedLocationProps {
  form: MapForm<any>;
  datacenters: Observable<SyntheticDatacenter[]>;
  updateForm: (form: MapForm<any>) => void;
}

const ManagedLocation = ({ form, datacenters, updateForm }: ManagedLocationProps) => {
  const managedPopDocsUrl = 'https://ibm.biz/Instana-hosted_PoP';

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
                linkDatacenters: <Link href={managedPopDocsUrl} external />
              }}
            />
          </Typography>
        </div>
        <List<SyntheticDatacenter>
          getHeader={() => null}
          columnDefinitions={getColumnDefinitions(form, updateForm)}
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

const getColumnDefinitions = (
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
): Array<ColumnDefinition<SyntheticDatacenter>> => {
  const datacentersField = form.get('syntheticDatacenters') as Field<SyntheticDatacenter[]>;
  const severity: Record<string, number> = { Active: 0, Pending: 5, Error: 10 };

  const onDatacenterSelect = (entity: SyntheticDatacenter) => {
    const selectedDatacenters = datacentersField.value;
    const {
      code,
      label,
      provider,
      countryName,
      cityName,
      latitude,
      longitude,
      status,
      // @ts-expect-error property not yet in type but present
      locationDisplayLabel,
      datacenterId
    } = entity;
    const index = selectedDatacenters.findIndex(datacenter => datacenter?.code === code);
    if (index !== -1) {
      selectedDatacenters.splice(index, 1);
    } else {
      selectedDatacenters.push({
        code,
        label,
        provider,
        countryName,
        cityName,
        latitude,
        longitude,
        status,
        // @ts-expect-error property not yet in type but present
        locationDisplayLabel,
        datacenterId
      });
    }
    updateForm(
      form.updateIn(['syntheticDatacenters'], (field: Item) =>
        (field as Field<SyntheticDatacenter[]>).setValue(selectedDatacenters).setTouched(true)
      )
    );
  };

  return [
    {
      id: 'datacenter_code',
      label: t('in-synthetics:dialog.createLocation.managedLocation.datacenterCode'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenter) {
        return (
          <Checkbox
            label={entity?.code}
            checked={datacentersField.value.findIndex(datacenter => datacenter?.code === entity?.code) !== -1}
            onChange={() => onDatacenterSelect(entity)}
            disabled={entity?.status !== 'Inactive'}
          />
        );
      }
    },
    {
      id: 'datacenter_name',
      label: t('in-synthetics:dialog.createLocation.managedLocation.datacenterName'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenter) {
        return <span className={locals.label}>{entity.label}</span>;
      }
    },
    {
      id: 'provider',
      label: t('in-synthetics:dialog.createLocation.managedLocation.provider'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenter) {
        return <span className={locals.label}>{datacenterProviderMap.get(entity.provider)}</span>;
      }
    },
    {
      id: 'location',
      label: t('in-synthetics:dialog.createLocation.managedLocation.locationName'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenter) {
        const locationName: string = entity?.locationLabel ?? '';
        return <span className={locals.label}>{locationName}</span>;
      }
    },
    {
      id: 'status',
      label: t('in-synthetics:dialog.createLocation.managedLocation.status'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenter) {
        return (
          <div className={locals.entityWrapper}>
            <HealthDot
              className={classNames({ [locals.dot]: true, [locals.inactive]: entity?.status === 'Inactive' })}
              severity={entity?.status ? severity[entity?.status] : undefined}
              iconSize={8}
            />
            <span>{entity?.status}</span>
          </div>
        );
      }
    }
  ];
};

export default ManagedLocation;
