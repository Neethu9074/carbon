/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { stateManagementPropType } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Li, Ul } from 'in-new-components/lists/List';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import useObservable from 'in-hooks/useObservable';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './SharedList.mless';

const columnDefinitions = [
  {
    width: '2.5rem',
    getContent({ checked, indeterminate, onChange, virtuallyChecked }) {
      return (
        <CheckboxFancy
          onChange={onChange}
          checked={checked}
          indeterminate={indeterminate}
          size="large"
          className={classNames({
            [locals.greyCheckbox]: virtuallyChecked
          })}
        />
      );
    }
  },
  {
    getContent({ label, tooltipSettings, isStaleItem, touched }) {
      return (
        <Tooltip
          content={
            isStaleItem ? (
              <span>
                {t('in-new-components:alerting.components.sharedListTooltip', { typeName: tooltipSettings.name })}
              </span>
            ) : null
          }
        >
          <div
            className={classNames({
              [locals.iconLabelTouched]: touched
            })}
          >
            <IconLabel text={label} type={tooltipSettings.iconType} width="100%" noBottomMargin ellipsis />
          </div>
        </Tooltip>
      );
    }
  },
  {
    width: 'max-content',
    getContent({ BadgeElement }) {
      return BadgeElement;
    }
  }
];

export default function SharedList({
  listData,
  renderSubList,
  stateManagement = {},
  canLoadMore,
  loadMore,
  isLoading,
  stateProcessors: {
    enhanceParentIdsWithChildId,
    entityType,
    getLabel$,
    getNoDataCustomText: noDataCustomText,
    getTooltipSettings,
    isIndeterminate,
    hasUserInteractedWithItem,
    isChecked,
    isImplicitlyChecked,
    shouldAdd,
    getBadgeElement
  },
  initiallyOpen,
  isFramed = true
}) {
  const { dispatch } = stateManagement;

  return (
    <Ul framed={isFramed}>
      {listData.map(({ item }) => {
        const { id, isStaleItem, label } = item;

        const _id = isStaleItem ? label : id; // for stale items label is equal to id
        const itemTreeIds = enhanceParentIdsWithChildId(isStaleItem ? label : _id);
        const _isIndeterminate = isIndeterminate(itemTreeIds);
        const _isChecked = isChecked(itemTreeIds);
        const _isImplicitlyChecked = isImplicitlyChecked(itemTreeIds);

        return (
          <Li
            key={_id}
            renderNestedContent={renderSubList?.(itemTreeIds)}
            toggleContentOnRowClick={Boolean(renderSubList)}
            className={locals.listItem}
            initiallyOpen={initiallyOpen}
          >
            <StaleItemLabelPropInjector getLabel$={getLabel$} isStaleItem={isStaleItem} originalLabel={label} id={_id}>
              {({ resolvedLabel, itemExistsInBackend }) => (
                <ColumnizedContent
                  label={resolvedLabel}
                  isStaleItem={isStaleItem && !itemExistsInBackend}
                  touched={hasUserInteractedWithItem(itemTreeIds)}
                  columnDefinitions={columnDefinitions}
                  tooltipSettings={getTooltipSettings()}
                  checked={_isIndeterminate ? null : _isImplicitlyChecked || _isChecked}
                  indeterminate={_isIndeterminate}
                  virtuallyChecked={!_isChecked && _isImplicitlyChecked}
                  onChange={() => {
                    if (shouldAdd(itemTreeIds)) {
                      dispatch({ type: `ADD_${entityType}`, ...itemTreeIds });
                    } else {
                      dispatch({ type: `REMOVE_${entityType}`, ...itemTreeIds });
                    }
                  }}
                  BadgeElement={getBadgeElement(item)}
                />
              )}
            </StaleItemLabelPropInjector>
          </Li>
        );
      })}
      {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
      {isLoading && <LoadingList numSkeletonRows="1" />}
      {!isLoading && !listData?.length && <NoDataAvailable text={noDataCustomText()} height={86} />}
    </Ul>
  );
}

function StaleItemLabelPropInjector({ getLabel$, isStaleItem, id, originalLabel, children }) {
  const staleItemLabel = useObservable(isStaleItem ? getLabel$({ id }).map(({ data }) => data?.label) : undefined, [
    isStaleItem,
    originalLabel
  ]);

  return children({
    resolvedLabel: staleItemLabel ?? originalLabel,
    itemExistsInBackend: Boolean(isStaleItem && staleItemLabel)
  });
}

SharedList.propTypes = {
  canLoadMore: PropTypes.bool,
  isLoading: PropTypes.bool,
  listData: PropTypes.arrayOf(
    PropTypes.shape({
      item: PropTypes.object
    })
  ).isRequired,
  loadMore: PropTypes.func.isRequired,
  renderSubList: PropTypes.func,
  stateManagement: stateManagementPropType,
  stateProcessors: PropTypes.shape({
    enhanceParentIdsWithChildId: PropTypes.func.isRequired,
    entityType: PropTypes.string.isRequired,
    getLabel$: PropTypes.func.isRequired,
    getNoDataCustomText: PropTypes.func.isRequired,
    getTooltipSettings: PropTypes.func.isRequired,
    isIndeterminate: PropTypes.func.isRequired,
    hasUserInteractedWithItem: PropTypes.func.isRequired,
    isChecked: PropTypes.func.isRequired,
    isImplicitlyChecked: PropTypes.func.isRequired,
    shouldAdd: PropTypes.func.isRequired,
    getBadgeElement: PropTypes.func.isRequired
  }).isRequired,
  initiallyOpen: PropTypes.bool,
  isFramed: PropTypes.bool
};
