/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { CodeSnippet } from '@carbon/react';
import { Language } from 'prism-react-renderer';
import React from 'react';

import { CarbonEmptyState, DataTable as CarbonDataTable, TableSkeleton, Pagination } from '@instana/components';
import { Result } from '@instana/types';

// import { DataTable } from '@carbon/react';
import { deletionTableLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { patterRecognitionLocalisationStrings } from 'in-logging/dashboard/Management/localisationStrings';
import { TableState } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { SortDirection, SortState } from 'in-logging/dashboard/Management/types';
import { hasError, isLoading } from 'in-services/util/result';
import { Options } from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from 'in-logging/dashboard/Management/PatternRecognition.mless';

export const STORAGE_KEY = 'hasSeenLogPatternModal';

export const hasSeenLogPatternModal = () => {
  return localStorage.getItem(STORAGE_KEY) === 'true';
};

export const markModalAsSeen = () => {
  localStorage.setItem(STORAGE_KEY, 'true');
};

export const getCarbonHeaders = (sortState: SortState) => {
  return [
    {
      key: patterRecognitionLocalisationStrings.id,
      header: patterRecognitionLocalisationStrings.id,
      isSortable: true,
      sortDirection: sortState.sortKey === patterRecognitionLocalisationStrings.id ? sortState.direction : 'NONE'
    },
    {
      key: patterRecognitionLocalisationStrings.name,
      header: patterRecognitionLocalisationStrings.name,
      isSortable: true,
      sortDirection: sortState.sortKey === patterRecognitionLocalisationStrings.name ? sortState.direction : 'NONE'
    },
    {
      key: patterRecognitionLocalisationStrings.patternsSample,
      header: patterRecognitionLocalisationStrings.patternsSample
    },
    {
      key: patterRecognitionLocalisationStrings.state,
      header: patterRecognitionLocalisationStrings.state
    }
  ];
};

const handleDataSorting = (key: string, setSortState: React.Dispatch<React.SetStateAction<SortState>>) => {
  setSortState(prevState => {
    const isSameKey = prevState.sortKey === key;

    let newDirection: SortDirection;
    if (!isSameKey) {
      newDirection = 'ASC';
    } else {
      switch (prevState.direction) {
        case 'ASC':
          newDirection = 'DESC';
          break;
        case 'DESC':
          newDirection = 'NONE';
          break;
        case 'NONE':
        default:
          newDirection = 'ASC';
          break;
      }
    }
    return {
      sortKey: key,
      direction: newDirection
    };
  });
};

export const LoadingSkeleton = (sortState: SortState) => (
  <TableSkeleton headers={getCarbonHeaders(sortState)} showHeader showToolbar />
);
export const EmptyState = (sortState: SortState) => (
  <div className={locals.emptyTable}>
    <CarbonDataTable
      title={patterRecognitionLocalisationStrings.discoveredPatterns}
      description={patterRecognitionLocalisationStrings.tableDescription}
      headers={getCarbonHeaders(sortState)}
      rows={[]}
    />
    <section className={locals.stateContainer}>
      <div data-testid="patternRecognitionEmpty" className={locals.emptyState}>
        <CarbonEmptyState
          icon="lib_carbon_empty_state_not_found"
          title={patterRecognitionLocalisationStrings.noLogsDiscovered}
          text={patterRecognitionLocalisationStrings.noLogsDiscoveredDescription}
        />
      </div>
    </section>
  </div>
);

export const ErrorState = (sortState: SortState) => (
  <div className={locals.emptyTable}>
    <CarbonDataTable
      title={patterRecognitionLocalisationStrings.discoveredPatterns}
      description={patterRecognitionLocalisationStrings.tableDescription}
      headers={getCarbonHeaders(sortState)}
      rows={[]}
    />
    <section className={locals.stateContainer}>
      <div data-testid={'patternRecognitionError'} className={locals.emptyState}>
        <CarbonEmptyState
          icon="lib_carbon_empty_state"
          title={deletionTableLocalisationStrings.wrong}
          text={deletionTableLocalisationStrings.errorInfo}
        />
      </div>
    </section>
  </div>
);

export interface DataTableProps {
  rows: Array<any>;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (pagination: { page: number; pageSize: number }) => void;
  pageSizes: number[];
  sortState: SortState;
  setSortState: React.Dispatch<React.SetStateAction<SortState>>;
}

const DataTable = ({
  rows,
  page,
  pageSize,
  totalItems,
  onPageChange,
  pageSizes,
  sortState,
  setSortState
}: DataTableProps) => (
  <>
    <CarbonDataTable
      title={patterRecognitionLocalisationStrings.discoveredPatterns}
      description={patterRecognitionLocalisationStrings.tableDescription}
      headers={getCarbonHeaders(sortState)}
      sortRow={({ sortHeaderKey }) => handleDataSorting(sortHeaderKey, setSortState)}
      rows={rows}
    />
    <Pagination
      page={page}
      pageSize={pageSize}
      totalItems={totalItems}
      onChange={onPageChange}
      pageSizes={pageSizes}
      itemsPerPageText={t('in-settings:tabs.deleteLogs.itemsPerPage')}
    />
  </>
);

export const content = {
  [TableState.LOADING]: ({ sortState }: { sortState: SortState }) => LoadingSkeleton(sortState),
  [TableState.EMPTY]: ({ sortState }: { sortState: SortState }) => EmptyState(sortState),
  [TableState.ERROR]: ({ sortState }: { sortState: SortState }) => ErrorState(sortState),
  [TableState.SUCCESS]: (props: DataTableProps) => <DataTable {...props} />
};

export const urlStateDefinition: Options<{ page: number; pageSize: number }> = {
  bind: [
    {
      path: '/patternRecognition',
      name: 'page',
      as: 'page',
      initialState: 1,
      parser: buildJsonParser(),
      serializer: buildJsonSerializer()
    },
    {
      path: '/deletpatternRecognition',
      name: 'pageSize',
      as: 'pageSize',
      initialState: 5,
      parser: buildJsonParser(),
      serializer: buildJsonSerializer()
    }
  ],
  reducer: (prevState, { page, pageSize }) => ({
    page: page ?? prevState.page,
    pageSize: pageSize ?? prevState.pageSize
  })
};

export const getCarbonDataRows = (
  patternRecognitionHistoryResult: Result<any>,
  getToggleStateFn: (id: string, status: boolean) => JSX.Element,
  sortState: SortState
) => {
  if (!patternRecognitionHistoryResult.data?.recognitions) return [];

  const keyMap: Record<string, keyof (typeof patternRecognitionHistoryResult.data.recognitions)[0]> = {
    [patterRecognitionLocalisationStrings.id]: 'id',
    [patterRecognitionLocalisationStrings.name]: 'name',
    [patterRecognitionLocalisationStrings.patternsSample]: 'patternsSample',
    [patterRecognitionLocalisationStrings.state]: 'status'
  };

  const data = [...patternRecognitionHistoryResult.data.recognitions];

  if (sortState.direction !== 'NONE') {
    const sortKey = keyMap[sortState.sortKey];

    data.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'ASC' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortState.direction === 'ASC' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortState.direction === 'ASC' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      }

      return 0;
    });
  }

  return data.map((item: any, i: number) => ({
    id: String(i),
    [patterRecognitionLocalisationStrings.id]: item.id,
    [patterRecognitionLocalisationStrings.name]: item.name,
    [patterRecognitionLocalisationStrings.patternsSample]: (
      <div className={locals.patternSampleColumn}>{formatText(truncate(item.patternsSample))}</div>
    ),
    [patterRecognitionLocalisationStrings.state]: getToggleStateFn(String(i), item.status)
  }));
};

const PATTERNS: { regex: RegExp; lang: Language }[] = [
  { regex: /\b\d{1,3}(\.\d{1,3}){3}\b/g, lang: 'bash' }, // IPs
  { regex: /\b\d{2}\/[A-Za-z]{3}\/\d{4}:\d{2}:\d{2}:\d{2} \+\d{4}\b/g, lang: 'bash' }, // Timestamps
  { regex: /\bhttps?:\/\/[^\s"]+/g, lang: 'bash' }, // URLs
  { regex: /\b(HTTP\/1\.1"|403|200|500|Timeout|Forbidden)\b/g, lang: 'bash' } // HTTP and Errors
];

const formatText = (text: string) => {
  let parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const combinedRegex = new RegExp(PATTERNS.map(p => p.regex.source).join('|'), 'g');

  let match;
  while ((match = combinedRegex.exec(text)) !== null) {
    const matchText = match[0];

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <CodeSnippet className={locals.codeSnippet} feedback="Copied to clipboard" type="inline">
        {matchText}
      </CodeSnippet>
    );

    lastIndex = combinedRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const MAX_LENGTH = 250;

const truncate = (text: string, maxLength = MAX_LENGTH) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
};

export const getTableState = (result: Result<any>): TableState => {
  if (hasError(result)) {
    return TableState.ERROR;
  }
  if (isLoading(result)) {
    return TableState.LOADING;
  }
  if (result.data?.recognitions?.length! > 0) {
    return TableState.SUCCESS;
  }
  if (result.data?.recognitions?.length === 0) {
    return TableState.EMPTY;
  }
  return TableState.EMPTY;
};
