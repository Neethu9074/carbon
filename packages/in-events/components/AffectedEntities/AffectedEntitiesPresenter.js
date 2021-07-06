/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  TableHorizontalIndicatorRow,
  TableLoadingSkeletonRows,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@instana/components';

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
    createItemLink$,
    items = []
  } = props;

  return (
    <Fragment>
      <Table>
        <Thead>
          <Tr size="compact">
            <Th noWrap>{t('in-events:affectedEntities.name')}</Th>
            <Th noWrap>{t('in-events:affectedEntities.violatedCalls')}</Th>
            <Th noWrap>{t('in-events:affectedEntities.totalCallsInAlert')}</Th>
            <Th noWrap>{t('in-events:affectedEntities.earliestTimestamp')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <TableHorizontalIndicatorRow cols={4} progress={progress} />
          {items.map((item, groupIndex) => (
            <AffectedEntity key={`${item.name}${groupIndex}`} item={item} createItemLink$={createItemLink$} />
          ))}
          {canLoadMore && renderLinkToAnalyzeAll && (
            <Tr size="compact">
              <Td colSpan={4}>
                <div className={locals.linkToAnalyseAllCalls}>{renderLinkToAnalyzeAll(totalHits)}</div>
              </Td>
            </Tr>
          )}
          {items.length === 0 && progress.loading && <TableLoadingSkeletonRows cols={4} />}
        </Tbody>
      </Table>
    </Fragment>
  );
}

AffectedEntitiesPresenter.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ),
  createItemLink$: PropTypes.any,

  progress: PropTypes.shape({
    loading: PropTypes.bool
  }).isRequired,

  canLoadMore: PropTypes.bool,
  renderLinkToAnalyzeAll: PropTypes.func,
  totalHits: PropTypes.number
};
