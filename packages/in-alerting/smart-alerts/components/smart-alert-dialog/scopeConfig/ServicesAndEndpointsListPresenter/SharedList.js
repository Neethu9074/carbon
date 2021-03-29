/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { stateManagementPropType } from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import { ColumnizedContent, Li, Ul } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { propTypeTimeConfig } from 'in-stores/time/config';
import IconLabel from 'in-alerting/components/IconLabel';
import { noop } from 'in-services/util/function';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/SharedList.mless';

const columnDefinitions = [
  {
    width: '2.5rem',
    getContent({ checked, indeterminate, onChange, virtuallyChecked, viewOnly }) {
      return (
        <CheckboxFancy
          onChange={viewOnly ? noop : onChange}
          checked={checked}
          indeterminate={indeterminate}
          size="large"
          className={classNames({
            [locals.viewOnly]: viewOnly,
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
                {t('in-alerting:smartAlerts.components.smartAlertDialog.sharedListTooltip', {
                  typeName: tooltipSettings.name
                })}
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
    getStaleEntity$,
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
  timeConfig,
  isFramed = true,
  viewOnly
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
            <StaleItemPropsInjector
              getStaleEntity$={getStaleEntity$}
              itemTreeIds={itemTreeIds}
              timeConfig={timeConfig}
              item={item}
              id={_id}
            >
              {({ resolvedLabel, itemExistsInBackend, bagdeContent }) => (
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
                  BadgeElement={getBadgeElement(bagdeContent)}
                  viewOnly={viewOnly}
                />
              )}
            </StaleItemPropsInjector>
          </Li>
        );
      })}
      {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
      {isLoading && <LoadingList numSkeletonRows="1" />}
      {!isLoading && !listData?.length && <NoDataAvailable text={noDataCustomText()} height={86} />}
    </Ul>
  );
}

function StaleItemPropsInjector({ getStaleEntity$, id, children, timeConfig, item }) {
  const { isStaleItem, label: originalLabel, types: originalTypes, type: originalType } = item;

  const { label, types, type } =
    useObservable(
      isStaleItem
        ? getStaleEntity$({
            id,
            filter: {
              timeConfig
            }
          }).map(({ data = {} }) => data)
        : just({}),
      [isStaleItem, id, timeConfig, item]
    ) ?? {};

  return children({
    resolvedLabel: label ?? originalLabel,
    itemExistsInBackend: Boolean(isStaleItem && label),
    bagdeContent: {
      types: types ?? originalTypes,
      type: type ?? originalType
    }
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
    getStaleEntity$: PropTypes.func.isRequired,
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
  timeConfig: propTypeTimeConfig,
  isFramed: PropTypes.bool,
  viewOnly: PropTypes.bool
};
