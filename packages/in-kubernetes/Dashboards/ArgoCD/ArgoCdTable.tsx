/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { DataTable as CarbonTable, Pagination as CarbonPagination, CarbonTag as Tag } from '@instana/components';
import { useObservable } from '@instana/hooks';

import getArgocdApplications from 'in-kubernetes/subscriptions/getArgocdApplications';
import { pendingResult } from 'in-services/fixedObjects';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './ArgoCD.mless';

interface ArgoCDTableProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

interface ArgoCDApplication {
  name?: string;
  syncStatus?: string;
  lastSync?: number;
  namespace?: string;
  repoURL?: string;
  repoBranch?: string;
  id?: string;
}

const ArgoCDTable = ({ snapshotId, timeConfig }: ArgoCDTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const result =
    useObservable(getArgocdApplications({ id: snapshotId, timeConfig }), [snapshotId, timeConfig]) ?? pendingResult;

  const [sortState, setSortState] = useState<{
    sortKey: keyof ArgoCDApplication;
    direction: 'ASC' | 'DESC' | 'NONE';
  }>({
    sortKey: 'syncStatus',
    direction: 'DESC'
  });

  const handleSort = (headerKey: keyof ArgoCDApplication) => {
    setSortState(prevState => {
      const isSameKey = prevState.sortKey === headerKey;
      let newDirection: 'ASC' | 'DESC' | 'NONE';
      if (isSameKey) {
        newDirection = prevState.direction === 'ASC' ? 'DESC' : 'ASC';
      } else {
        newDirection = 'ASC';
      }
      return { sortKey: headerKey, direction: newDirection };
    });
  };

  const argoCDApplicationsData = result?.data;
  if (!argoCDApplicationsData) {
    return null;
  }

  const headers = [
    {
      header: t('in-kubernetes:argocd.argoCdAppName'),
      key: 'name',
      isSortable: true,
      sortDirection: sortState.sortKey === 'name' ? sortState.direction : 'NONE'
    },
    {
      header: t('in-kubernetes:argocd.syncStatusTitle'),
      key: 'syncStatus',
      isSortable: true,
      sortDirection: sortState.sortKey === 'syncStatus' ? sortState.direction : 'NONE'
    },
    {
      header: t('in-kubernetes:argocd.namespaceTitle'),
      key: 'namespace',
      isSortable: true,
      sortDirection: sortState.sortKey === 'namespace' ? sortState.direction : 'NONE'
    },
    {
      header: t('in-kubernetes:argocd.repoAndBranch'),
      key: 'repoURL',
      isSortable: true,
      sortDirection: sortState.sortKey === 'repoURL' ? sortState.direction : 'NONE',
      width: '100rem'
    },
    {
      header: t('in-kubernetes:argocd.lastSync'),
      key: 'lastSync',
      isSortable: true,
      sortDirection: sortState.sortKey === 'lastSync' ? sortState.direction : 'NONE'
    }
  ];

  const formattedRows: ArgoCDApplication[] = Object.entries(
    argoCDApplicationsData as Record<string, ArgoCDApplication>
  ).map(([_, value], index) => ({
    id: value.name ?? `row-${index}`,
    ...(typeof value === 'object' && value !== null ? value : { data: value })
  }));

  const sortedRows = [...formattedRows].sort((a, b) => {
    const { sortKey, direction } = sortState;
    if (!sortKey || direction === 'NONE') return 0;

    let aValue = a[sortKey];
    let bValue = b[sortKey];

    const aStr = aValue != null ? String(aValue).toLowerCase() : '';
    const bStr = bValue != null ? String(bValue).toLowerCase() : '';

    if (aStr === bStr) return 0;
    if (direction === 'ASC') {
      return aStr > bStr ? 1 : -1;
    } else {
      return aStr > bStr ? -1 : 1;
    }
  });

  const carbonRows = sortedRows.map((item, index) => {
    let tagType, label;
    if (item.syncStatus == 'Synced') {
      tagType = 'green';
      label = t('in-kubernetes:argocd.synced');
    } else if (item.syncStatus == 'OutOfSync') {
      tagType = 'red';
      label = t('in-kubernetes:argocd.outOfSync');
    } else {
      tagType = 'grey';
      label = t('in-kubernetes:argocd.unknown');
    }
    const mins = getTimeSinceEpoch(item.lastSync ?? 0);

    return {
      id: `row-${index}`,
      ['syncStatus']: (
        <Tag size="md" type={tagType}>
          {label}
        </Tag>
      ),
      ['name']: item.name,
      ['namespace']: item.namespace,
      ['repoURL']: (
        <>
          {item.repoURL} <br />
          {t('in-kubernetes:argocd.branch')}:{' '}
          <a href={formatRepoLink(item)} target="_blank" rel="noopener noreferrer">
            {item.repoBranch}
          </a>
        </>
      ),
      ['lastSync']: mins
    };
  });

  const pagedRows = () => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return carbonRows.slice(startIndex, endIndex);
  };

  const updatePageState = ({ page, pageSize }: { page: number; pageSize: number }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <div className={locals.argoCD}>
      <CarbonTable
        headers={headers}
        rows={pagedRows()}
        isSearchEnabled
        sortRow={({ sortHeaderKey }) => handleSort(sortHeaderKey as keyof ArgoCDApplication)}
        searchText=""
        size="xl"
      />

      {carbonRows.length > 10 && (
        <CarbonPagination
          totalItems={carbonRows.length}
          pageSize={pageSize}
          pageSizes={[10, 20, 30]}
          page={page}
          onChange={updatePageState}
        />
      )}
    </div>
  );
};

export const getTimeSinceEpoch = (epoch: number): string => {
  if (epoch === 0) return '';

  const now = Date.now();
  const diff = Math.abs(now - epoch);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60)
    return `${seconds} ${seconds !== 1 ? t('in-kubernetes:argocd.seconds') : t('in-kubernetes:argocd.second')}`;
  if (minutes < 60)
    return `${minutes} ${minutes !== 1 ? t('in-kubernetes:argocd.minutes') : t('in-kubernetes:argocd.minute')}`;
  if (hours < 24) return `${hours} ${hours !== 1 ? t('in-kubernetes:argocd.hours') : t('in-kubernetes:argocd.hour')}`;
  return `${days} ${days !== 1 ? t('in-kubernetes:argocd.days') : t('in-kubernetes:argocd.day')}`;
};

export const formatRepoLink = ({ repoURL, repoBranch }: ArgoCDApplication) => {
  // Remove .git if present
  const formattedURL = repoURL?.replace(/\.git$/, '');
  // Build branch URL
  return `${formattedURL}/tree/${repoBranch}`;
};

export default ArgoCDTable;
