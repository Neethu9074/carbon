/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { ApplicationItem, ContextScope, OrderDirection, PaginatedResult, Result, TimeConfig } from '@instana/types';
import { CarbonModal, Stack, ValidationBlock } from '@instana/components';
import { useObservable } from '@instana/hooks';

import ListServerDataTable from 'in-alerting/smart-alerts/components/ListTable/ListServerDataTable';
import { getApplicationsWithDefaults } from 'in-applications/subscriptions/getApplications';
import { close } from 'in-components/DialogPresenter/store';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import locals from './ApplicationEntitySection.mless';

const headers = [
  { key: 'name', header: t('in-events:eventsSmartAlerts.dialog.name'), isSortable: true, sortKey: 'applicationLabel' }
];

const pagination = {
  page: 1,
  size: 10
};
interface ApplicationEntitySectionProps {
  handleSelectedApplication: (selectedId: string | undefined) => void;
}

export default function ApplicationEntitySection({ handleSelectedApplication }: ApplicationEntitySectionProps) {
  const timeConfig = useTimeConfig();
  const [selectedIds, setSelectedIds] = useState<string | undefined>(undefined);
  const [validationMessage, setValidationMessage] = useState(false);

  return (
    <CarbonModal
      isFullWidth
      open
      onRequestClose={close}
      modalHeading={t('in-events:eventsSmartAlerts.dialog.selectApplication')}
      primaryButtonText={t('in-events:eventsSmartAlerts.dialog.proceed')}
      secondaryButtonText={t('in-events:eventsSmartAlerts.dialog.cancel')}
      size="lg"
      onRequestSubmit={() => {
        if (selectedIds) {
          close();
          setValidationMessage(false);
          handleSelectedApplication(selectedIds);
        }
        setValidationMessage(true);
      }}
    >
      <div className={locals.container}>
        <Stack gap="small">
          <div>
            <ApplicationList
              timeConfig={timeConfig}
              setSelectedIds={setSelectedIds}
              selectedItem={selectedIds}
              setValidationMessage={setValidationMessage}
            />
          </div>
          {validationMessage && (
            <ValidationBlock>{t('in-events:eventsSmartAlerts.dialog.selectApplicationToProceed')}</ValidationBlock>
          )}
        </Stack>
      </div>
    </CarbonModal>
  );
}

interface ApplicationRow {
  id: string;
  [key: string]: any;
}

interface ApplicationData {
  timeConfig: TimeConfig;
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: OrderDirection;
  contextScope: ContextScope;
}

interface Sort {
  sortKey: string;
  sortDirection: OrderDirection;
}

function useApplicationData(timeConfig: TimeConfig, page: number, pageSize: number, query: string, sort: Sort) {
  const params: ApplicationData = {
    timeConfig,
    query: query,
    page: page,
    pageSize: pageSize,
    orderBy: sort.sortKey,
    orderDirection: sort.sortDirection,
    contextScope: 'NONE'
  };

  return getApplicationsWithDefaults(params);
}

interface ApplicationListProps {
  timeConfig: TimeConfig;
  setSelectedIds: (id: string) => void;
  selectedItem?: string;
  setValidationMessage: (arg: boolean) => void;
}

export function ApplicationList({
  timeConfig,
  setSelectedIds,
  selectedItem,
  setValidationMessage
}: ApplicationListProps) {
  const [page, setPage] = useState(pagination.page);
  const [sort, setSort] = useState({ sortKey: 'callsAgg', sortDirection: 'DESC' } as Sort);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(pagination.size);

  const applicationList = useObservable(useApplicationData(timeConfig, page, pageSize, query, sort), [
    timeConfig,
    page,
    pageSize,
    query,
    sort
  ]);

  const totalItems = applicationList?.data?.totalHits ?? 0;

  const rows = mapLicenseResultToRows(applicationList);

  function mapLicenseResultToRows(result: Result<PaginatedResult<ApplicationItem>> | Nullish): ApplicationRow[] {
    return (
      result?.data?.items?.map((item: ApplicationItem) => {
        return {
          id: item.application.id,
          name: item.application.label
        };
      }) ?? []
    );
  }

  if (!applicationList) {
    return <></>;
  }

  return (
    <ListServerDataTable
      rows={rows}
      page={page}
      pageSize={pageSize}
      totalItems={totalItems}
      isLoading={isLoading(applicationList)}
      onPaginationChange={(newPage: number, newSize: number) => {
        setPage(newPage);
        setPageSize(newSize);
      }}
      headers={headers}
      selectAction={(item: ApplicationRow) => {
        setSelectedIds(item.id);
        // hide validation message
        setValidationMessage(false);
      }}
      onSearch={(q: string) => {
        if (q !== query) {
          setPage(pagination.page);
          setPageSize(pagination.size);
          setQuery(q);
        }
      }}
      sortDirection={sort.sortDirection}
      sortKey={sort.sortKey}
      sortBy={(sortKey: string, sortDirection: OrderDirection) => {
        setSort({ sortKey, sortDirection });
      }}
      query={query}
      selectedItem={selectedItem}
      isSelectable
      isRadio
      isSearchable
    />
  );
}
