/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Link, Typography, Checkbox } from '@instana/components';
import { SyntheticDatacenter } from '@instana/types';
import { just } from '@instana/observables';

import ActivateConfirmationDialog from 'in-synthetics/dashboards/global/tabs/locations/components/ActivateConfirmationDialog';
// eslint-disable-next-line no-restricted-imports
import List, { ColumnDefinition } from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import CancelButton from 'in-components/form/CancelButton';
import BaseDialog from 'in-components/Dialog/BaseDialog';
import { Trans, t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/locations/components/DeactivateSelectedLocation.mless';

interface Props {
  datacenter: SyntheticDatacenter[];
  onClose: () => void;
}

export const getColumnDefinitions = (): Array<ColumnDefinition<SyntheticDatacenter>> => {
  const severity: Record<string, number> = { Active: 0, Pending: 5, Error: 10 };
  return [
    {
      id: 'datacenter_code',
      label: t('in-synthetics:dialog.createLocation.managedLocation.datacenterCode'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticDatacenter) {
        return <Checkbox label={entity?.code} checked onChange={() => true} />;
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

const ActivateSelectedLocation = ({ datacenter, onClose }: Props) => {
  const managedPopDocsUrl = 'https://ibm.biz/Instana-hosted_PoP';

  const onActivate = () => {
    onClose();
    addActiveDialog(<ActivateConfirmationDialog singleDatacenter={datacenter} onClose={onClose} />);
  };

  const customButtons = (
    <>
      <CancelButton onClick={onClose} isSaving={false} />
      <SaveButton kind="primary" isSaving={false} disabled={datacenter[0]?.status != 'Inactive'}>
        {t('in-synthetics:dialog.createLocation.managedLocation.activate')}
      </SaveButton>
    </>
  );

  return (
    <BaseDialog
      title={t('in-synthetics:dialog.createLocation.managedLocation.activateLocation')}
      headerIcon={'lib_synthetic_location'}
      onClose={onClose}
      onSubmit={() => onActivate()}
      customButtons={customButtons}
    >
      <div className={locals.descriptionWrapper}>
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
        columnDefinitions={getColumnDefinitions()}
        loadEntities={() => just(datacenter)}
        renderNoDataAvailable={() => (
          <NoDataAvailable
            type="lib_synthetic"
            height={160}
            text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Datacenter' })}
          />
        )}
        isSearchable={false}
        pageSize={1}
        initialOrderBy="label"
      />
    </BaseDialog>
  );
};

export default ActivateSelectedLocation;
