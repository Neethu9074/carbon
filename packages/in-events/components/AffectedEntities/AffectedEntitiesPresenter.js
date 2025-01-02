/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { DataTable as CarbonDataTable, LoadingSkeleton } from '@instana/components';

import { AffectedEntity } from 'in-events/components/AffectedEntities/AffectedEntity';
import { finishedProgress } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from 'in-events/components/AffectedEntities/AffectedEntities.mless';

export default function AffectedEntitiesPresenter(props) {
  const {
    totalHits,
    canLoadMore,
    progress = finishedProgress,
    renderLinkToAnalyzeAll,
    createItemLink,
    items = []
  } = props;

  const carbonHeaders = [
    {
      key: 'name',
      header: t('in-events:affectedEntities.name')
    },
    {
      key: 'calls',
      header: t('in-events:affectedEntities.violatedCalls')
    },
    {
      key: 'totalCalls',
      header: t('in-events:affectedEntities.totalCallsInAlert')
    },
    {
      key: 'timestamp',
      header: t('in-events:affectedEntities.earliestTimestamp')
    }
  ];

  const carbonRows = items.map((item, groupIndex) => {
    const { name } = item;
    const row = AffectedEntity({
      id: `${name}${groupIndex}`,
      item,
      createItemLink: createItemLink
    });
    return row;
  });

  return (
    <>
      <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
      {progress.loading && items.length === 0 && <LoadingSkeleton className={locals.skeleton} />}
      {canLoadMore && renderLinkToAnalyzeAll && (
        <div className={locals.linkToAnalyseAllCalls}>{renderLinkToAnalyzeAll(totalHits)}</div>
      )}
    </>
  );
}

AffectedEntitiesPresenter.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ),
  createItemLink: PropTypes.any,

  progress: PropTypes.shape({
    loading: PropTypes.bool
  }).isRequired,

  canLoadMore: PropTypes.bool,
  renderLinkToAnalyzeAll: PropTypes.func,
  totalHits: PropTypes.number
};
