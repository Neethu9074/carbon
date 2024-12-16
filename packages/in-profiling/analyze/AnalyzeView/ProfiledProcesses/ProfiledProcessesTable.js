/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonTable, TableSkeleton as CarbonTableSkeleton, LoadingSkeleton } from '@instana/components';
import { Table, Thead, Tbody, Tr, TableLoadMoreRow, Th } from '@instana/legacy';
import { useObservable } from '@instana/hooks';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { useLinkToProfiles } from 'in-components/Profiling/navigation/paths';
import Rows from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/Rows';
import { getSnapshotVersionsObservable, HostInformation } from './Row';
import { carbonTableEnabled } from 'in-services/featureFlags';
import EntityLink from 'in-components/EntityLink';
import { t } from 'in-i18n';

import locals from './ProfiledProcessesTable.mless';

export default function ProfiledProcessesTable(props) {
  const { loadMore, canLoadMore, items, progress, errors } = props;
  const columnCount = 2;
  const isInitialLoading = progress?.loading && items.length === 0;
  const isLoading = progress?.loading;
  const hasErrors = errors?.length > 0;

  if (carbonTableEnabled) {
    const carbonHeaders = [
      {
        key: t('in-profiling:process'),
        header: t('in-profiling:process')
      },
      {
        key: t('in-profiling:host'),
        header: t('in-profiling:host')
      }
    ];

    if (isInitialLoading) {
      return <CarbonTableSkeleton headers={carbonHeaders} columnCount={columnCount} rowCount={3} />;
    } else if (hasErrors) {
      return <ErroneousResultPresenter errors={errors} />;
    }

    const carbonRows = items.map(item => {
      const profiledProcess = item.profiledProcess;
      return {
        id: profiledProcess.processSnapshotId,
        [t('in-profiling:process')]: <EntityLinkToProfiles item={profiledProcess} />,
        [t('in-profiling:host')]: <HostInformation hostSnapshotPreview={profiledProcess.hostSnapshotPreview} />
      };
    });
    return (
      <>
        <CarbonTable loading={isLoading} isSearchEnabled={false} headers={carbonHeaders} rows={carbonRows} />
        {isLoading && <LoadingSkeleton className={locals.loadingSkeleton} />}
        {canLoadMore && (
          <TableLoadMoreRow className={locals.carbonLoadMore} loadMore={loadMore} size="compact" cols={columnCount} />
        )}
      </>
    );
  }

  return (
    <>
      <Table>
        <Thead>
          <Tr size="compact">
            <Th noWrap>{t('in-profiling:process')}</Th>
            <Th noWrap>{t('in-profiling:host')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Rows {...props} cols={columnCount} />
          {canLoadMore && <TableLoadMoreRow loadMore={loadMore} size="compact" cols={columnCount} />}
        </Tbody>
      </Table>
    </>
  );
}

function EntityLinkToProfiles({ item }) {
  const linkToProfiles = useLinkToProfiles({ processSnapshotId: item.processSnapshotId, time: item.time });
  const observable = useObservable;
  let entityLabel = item.entityLabel;
  let entityPlugin = item.entityPlugin;
  if (entityLabel === null) {
    const snapshot = observable(getSnapshotVersionsObservable, [item.processSnapshotId, item.time]);
    entityLabel = snapshot ? snapshot.get('label') : 'Unknown';
    entityPlugin = snapshot ? snapshot.get('plugin') : undefined;
  }

  return <EntityLink href$={linkToProfiles} plugin={entityPlugin} label={entityLabel} />;
}
