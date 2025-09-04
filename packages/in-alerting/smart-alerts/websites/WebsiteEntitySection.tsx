/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';

import { CarbonModal, CarbonRadioButton, Stack } from '@instana/components';

import ListDataTable from 'in-alerting/smart-alerts/components/ListTable/ListTable';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import { getWebsites } from 'in-websites/api/websites';
import { t } from 'in-i18n';

import locals from './WebsiteEntitySection.mless';

interface WebsiteEntitySectionProps {
  handleSelectedWebsite: (websiteId: string) => void;
}

interface websiteEntity {
  appName: string;
  id: string;
  name: string;
}

export default function WebsiteEntitySection({ handleSelectedWebsite }: WebsiteEntitySectionProps) {
  const configs = useMemo(() => getWebsites(), []);
  const [selectedIds, setSelectedIds] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState(false);

  const columnDefinitions = [
    {
      id: 'checkbox',
      label: '',
      getContent(item: websiteEntity) {
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
      getContent(item: websiteEntity) {
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
      modalHeading={t('in-events:eventsSmartAlerts.dialog.selectWebsite')}
      primaryButtonText={t('in-events:eventsSmartAlerts.dialog.proceed')}
      secondaryButtonText={t('in-events:eventsSmartAlerts.dialog.cancel')}
      size="lg"
      onRequestSubmit={() => {
        if (selectedIds) {
          close();
          setValidationMessage(false);
          handleSelectedWebsite(selectedIds);
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
            noDataDescription={t('in-events:eventsSmartAlerts.dialog.noDataEmptyListStateSubtitle')}
            pageSizes={[10, 20, 40, 60, 80, 100]}
            isSearchable
          />
          {validationMessage && (
            <ValidationBlock>{t('in-events:eventsSmartAlerts.dialog.selectWebsiteToProceed')}</ValidationBlock>
          )}
        </Stack>
      </div>
    </CarbonModal>
  );
}
