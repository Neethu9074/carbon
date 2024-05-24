/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { LocationListItem } from '@instana/types';
import { Message } from '@instana/components';
import { just } from '@instana/observables';

import {
  showLocationDeactivateErrorMessage,
  showLocationDeactivateSuccessMessage
} from 'in-synthetics/createTests/utils/userFeedback';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import BaseDialog from 'in-components/Dialog/BaseDialog';
import { deactivateLocation } from 'in-synthetics/api';
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
          <HealthDot className={classNames({ [locals.dot]: true })} severity={0} iconSize={8} />
          <span>{t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.activeStatus')}</span>
        </span>
      );
    }
  }
];

const DeactivateSelectedLocation = ({ item }: Props) => {
  const locationDisplayLabel: string = item.displayLabel;
  const [isSaving, setIsSaving] = useState(false);
  const customButtons = (
    <>
      <CancelButton onClick={close} isSaving={isSaving} />
      <SaveButton kind="primary" isSaving={isSaving}>
        {t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.deactivateButton')}
      </SaveButton>
    </>
  );

  const onDeactivate = () => {
    const action$ = deactivateLocation(item.id);
    setIsSaving(true);

    action$.once(() => {
      setIsSaving(false);
      close();
      showLocationDeactivateSuccessMessage();
    });

    action$.errors().once(error => {
      setIsSaving(false);
      close();
      showLocationDeactivateErrorMessage(error.message.split(':')[2]);
    });
  };

  return (
    <BaseDialog
      title={t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.title')}
      headerIcon={'lib_synthetic_location'}
      onClose={close}
      onSubmit={() => onDeactivate()}
      customButtons={customButtons}
    >
      <div className={locals.descriptionWrapper}>
        <DangerousHtmlPresenter
          className={locals.htmlText}
          html={t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.deactivateMessage', {
            locationDisplayLabel
          })}
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
      <Message withIcon type="neutral" className={locals.message} inline>
        {t('in-synthetics:dialog.createLocation.managedLocation.deactivateDatacenter.warningMessage')}
      </Message>
    </BaseDialog>
  );
};

export default DeactivateSelectedLocation;
