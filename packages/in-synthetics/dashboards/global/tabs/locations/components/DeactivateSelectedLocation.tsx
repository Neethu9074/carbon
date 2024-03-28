/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { LocationListItem } from '@instana/types';
import { Message } from '@instana/components';
import { just } from '@instana/observables';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { close } from 'in-components/DialogPresenter/store';
import BaseDialog from 'in-components/Dialog/BaseDialog';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/locations/components/DeactivateSelectedLocation.mless';

interface Props {
  item: LocationListItem;
}

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-synthetics:dialog.createLocation.managedLocation.locationName'),
    getContent(entity: LocationListItem) {
      return <span>{entity.label}</span>;
    }
  },
  {
    id: 'displayLabel',
    label: t('in-synthetics:dialog.createLocation.managedLocation.displayName'),
    getContent(entity: LocationListItem) {
      return <span>{entity.displayLabel}</span>;
    }
  },
  {
    id: 'status',
    label: t('in-synthetics:dialog.createLocation.managedLocation.locationStatus'),
    getContent() {
      return (
        <span className={locals.entityWrapper}>
          <HealthDot className={classNames({ [locals.dot]: true })} severity={5} iconSize={8} />
          <span>
            {t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.deactivatingStatus')}
          </span>
        </span>
      );
    }
  }
];

const DeactivateSelectedLocation = ({ item }: Props) => {
  const customButton = (
    <SaveButton kind="primary">
      {t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.button')}
    </SaveButton>
  );

  return (
    <BaseDialog
      title={t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.title')}
      headerIcon={'lib_synthetic_location'}
      onClose={close}
      onSubmit={() => close()}
      customButtons={customButton}
    >
      <div className={locals.descriptionWrapper}>
        <DangerousHtmlPresenter
          className={locals.htmlText}
          html={t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.deactivateMessage')}
        />
      </div>
      <List<LocationListItem>
        getHeader={() => null}
        columnDefinitions={columnDefinitions}
        loadEntities={() => just([item])}
        renderNoDataAvailable={() => (
          <NoDataAvailable
            type="lib_synthetic"
            height={160}
            text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Location' })}
          />
        )}
        isSearchable={false}
        pageSize={1}
        initialOrderBy="label"
      />
      <Message withIcon type="neutral" className={locals.message}>
        {t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.warningMessage')}
      </Message>
    </BaseDialog>
  );
};

export default DeactivateSelectedLocation;
