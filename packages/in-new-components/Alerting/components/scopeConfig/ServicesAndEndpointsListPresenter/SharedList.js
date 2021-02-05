/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

import { stateManagementPropType } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Li, Ul } from 'in-new-components/lists/List';
import IconLabel from 'in-new-components/Alerting/components/IconLabel';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import useObservable from 'in-hooks/useObservable';
import Tooltip from 'in-components/Tooltip';

import locals from './SharedList.mless';

const columnDefinitions = [
  {
    width: '3rem',
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
            <IconLabel text={label} type={tooltipSettings.iconType} noBottomMargin />
          </div>
        </Tooltip>
      );
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
    hasChildren,
    hasUserInteractedWithItem,
    isChecked,
    isExplicitlyExcluded,
    isImplicitlyChecked
  },
  initiallyOpen
}) {
  const { state, dispatch } = stateManagement;
  const checkedObjectIdRef = useRef(null);
  const list = useSortList(state.userSelectionModel, listData, enhanceParentIdsWithChildId, hasUserInteractedWithItem);

  return (
    <Ul>
      {!isLoading &&
        list.map(({ item: { id, label, isStaleItem } }) => {
          const _id = isStaleItem ? label : id; // for stale items label is equal to id
          const itemTreeIds = enhanceParentIdsWithChildId(isStaleItem ? label : _id);
          const _hasChildren = hasChildren(itemTreeIds);
          const _isChecked = isChecked(itemTreeIds);
          const _isImplicitlyChecked = isImplicitlyChecked(itemTreeIds);

          return (
            <Li
              key={_id}
              renderNestedContent={renderSubList?.(itemTreeIds)}
              toggleContentOnRowClick={Boolean(renderSubList)}
              className={classNames({
                [locals.listItem]: true,
                [locals.last]: _id === checkedObjectIdRef.current
              })}
              initiallyOpen={initiallyOpen}
            >
              <StaleItemLabelPropInjector
                getLabel$={getLabel$}
                isStaleItem={isStaleItem}
                originalLabel={label}
                id={_id}
              >
                {({ resolvedLabel, itemExistsInBackend }) => (
                  <ColumnizedContent
                    label={resolvedLabel}
                    isStaleItem={isStaleItem && !itemExistsInBackend}
                    touched={hasUserInteractedWithItem(itemTreeIds)}
                    columnDefinitions={columnDefinitions}
                    tooltipSettings={getTooltipSettings()}
                    checked={_hasChildren ? null : _isImplicitlyChecked || _isChecked}
                    indeterminate={_hasChildren}
                    virtuallyChecked={!_isChecked && _isImplicitlyChecked}
                    onChange={() => {
                      checkedObjectIdRef.current = _id;

                      const implicit = !_isChecked && _isImplicitlyChecked;
                      const unchecked = !_isChecked && !_isImplicitlyChecked;

                      if ((implicit || unchecked) && !isExplicitlyExcluded(itemTreeIds)) {
                        dispatch({
                          type: `ADD_${entityType}`,
                          ...itemTreeIds,
                          inclusive: !_isImplicitlyChecked
                        });
                      } else {
                        dispatch({ type: `REMOVE_${entityType}`, ...itemTreeIds });
                      }
                    }}
                  />
                )}
              </StaleItemLabelPropInjector>
            </Li>
          );
        })}
      {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
      {isLoading && <LoadingList numSkeletonRows={3} />}
      {!isLoading && (!listData || listData.length === 0) && <NoDataAvailable text={noDataCustomText()} height={86} />}
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

function useSortList(userSelectionModel, listData, enhanceParentIdsWithChildId, hasUserInteractedWithItem) {
  const enhancedList = useMemo(() => {
    const itemsUserInteractedWith = listData.filter(({ item: { id, isStaleItem } }) => {
      const itemTreeIds = enhanceParentIdsWithChildId(id);
      return hasUserInteractedWithItem(itemTreeIds) || isStaleItem; // a stale item is an item the user has interacted with, so it's also sorted to the top of the list
    });
    const itemsInDefaultState = listData.filter(listItem => !itemsUserInteractedWith.includes(listItem));
    return [...itemsUserInteractedWith, ...itemsInDefaultState];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectionModel, listData]);

  return enhancedList ?? listData;
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
    hasChildren: PropTypes.func.isRequired,
    hasUserInteractedWithItem: PropTypes.func.isRequired,
    isChecked: PropTypes.func.isRequired,
    isExplicitlyExcluded: PropTypes.func.isRequired,
    isImplicitlyChecked: PropTypes.func.isRequired
  }).isRequired,
  initiallyOpen: PropTypes.bool
};
