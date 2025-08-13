/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';

import { CarbonRadioButton, Stack } from '@instana/components';
import { CarbonModal } from '@instana/components';

import ListDataTable from 'in-alerting/smart-alerts/components/ListTable/ListTable';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { getMobileApps } from 'in-mobile-apps/api/mobileApps';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './MobileAppEntitySection.mless';

interface MobileAppEntitySectionProps {
  handleSelectedMobileApp: (id: string) => void;
}

interface MobileAppEntity {
  id: string;
  name: string;
}

export default function MobileAppEntitySection({ handleSelectedMobileApp }: MobileAppEntitySectionProps) {
  const configs = useMemo(() => getMobileApps(), []);
  const [selectedIds, setSelectedIds] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState(false);

  const columnDefinitions = [
    {
      id: 'checkbox',
      label: '',
      getContent(item: MobileAppEntity) {
        return (
          <div className={locals.radio}>
            <CarbonRadioButton
              onChange={() => {
                setSelectedIds(item.id);
                // hide validation message
                setValidationMessage(false);
              }}
              labelText=""
              checked={item.id === selectedIds}
            />
          </div>
        );
      }
    },
    {
      id: 'name',
      label: t('in-events:eventsSmartAlerts.dialog.name'),
      getContent(item: MobileAppEntity) {
        return <div className={locals.name}>{item.name}</div>;
      },
      sortable: true
    }
  ];

  return (
    <CarbonModal
      isFullWidth
      open
      onRequestClose={close}
      modalHeading={t('in-events:eventsSmartAlerts.dialog.selectMobileApp')}
      primaryButtonText={t('in-events:eventsSmartAlerts.dialog.proceed')}
      secondaryButtonText={t('in-events:eventsSmartAlerts.dialog.cancel')}
      size="lg"
      onRequestSubmit={() => {
        if (selectedIds) {
          close();
          setValidationMessage(false);
          handleSelectedMobileApp(selectedIds);
        }
        setValidationMessage(true);
      }}
    >
      <div className={locals.container}>
        <Stack gap="small">
          <ListDataTable
            columnDefinitions={columnDefinitions}
            loadEntities={() => configs}
            initialOrderBy="pageViewsAgg"
            listPageSize={10}
            noDataHeader={t('in-events:eventsSmartAlerts.dialog.noDataEmptyListStateTitle')}
            noDataSubHeader={t('in-events:eventsSmartAlerts.dialog.noDataEmptyListStateSubtitle')}
            noDataDescription={t('in-events:eventsSmartAlerts.dialog.noDataEmptyListStateIllustrationDescription')}
            isSearchable
          />
          {validationMessage && (
            <ValidationBlock>{t('in-events:eventsSmartAlerts.dialog.selectMobileAppToProceed')}</ValidationBlock>
          )}
        </Stack>
      </div>
    </CarbonModal>
  );
}
