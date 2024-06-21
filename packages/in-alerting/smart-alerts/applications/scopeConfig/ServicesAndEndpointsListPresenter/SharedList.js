/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { ColumnizedContent, Li, Ul, Message, Checkbox } from '@instana/components';
import { LiLoadMore } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { stateManagementPropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { propTypeTimeConfig } from 'in-stores/time/config';
import IconLabel from 'in-alerting/components/IconLabel';
import { noop } from 'in-services/util/function';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/SharedList.mless';

export default function SharedList({
  listData,
  renderSubList,
  stateManagement = {},
  canLoadMore,
  loadMore,
  isLoading,
  shouldShowPlaceholderForEmptySelection,
  validationError,
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
  viewOnly,
  tearSheetView
}) {
  const columnDefinitions = [
    {
      width: '2.5rem',
      getContent({ checked, indeterminate, onChange, virtuallyChecked, viewOnly }) {
        return (
          <Checkbox
            onChange={viewOnly ? noop : onChange}
            checked={checked}
            indeterminate={indeterminate}
            disabled={viewOnly}
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
            align="topLeft"
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
              <IconLabel
                text={label}
                type={tooltipSettings.iconType}
                width="100%"
                color={isStaleItem ? themes.default.ids.color.option.neutral['400'] : undefined}
                noBottomMargin
                ellipsis
              />
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
  const { dispatch } = stateManagement;

  return (
    <Ul framed={isFramed}>
      {validationError && (
        <Li className={locals.listItem}>
          <ValidationBlock>{validationError}</ValidationBlock>
        </Li>
      )}
      {shouldShowPlaceholderForEmptySelection && listData.length === 0 && (
        <Li>
          <Message
            className={locals.emptyListPlaceholderMessage}
            withIcon
            title={t('in-alerting:components.chart.alertingChartMessageEmptyApplicationSelection')}
          />
        </Li>
      )}
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
            className={classNames({ [locals.listItem]: !tearSheetView, [locals.lightBgListItem]: tearSheetView })}
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
      {canLoadMore && (
        <LiLoadMore loadMore={loadMore} className={classNames({ [locals.greyBackground]: tearSheetView })} />
      )}
      {isLoading && <LoadingList numSkeletonRows="1" />}
      {!shouldShowPlaceholderForEmptySelection && !isLoading && !listData?.length && (
        <NoDataAvailable text={noDataCustomText()} height={86} />
      )}
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
  shouldShowPlaceholderForEmptySelection: PropTypes.bool,
  listData: PropTypes.arrayOf(
    PropTypes.shape({
      item: PropTypes.object
    })
  ).isRequired,
  loadMore: PropTypes.func.isRequired,
  renderSubList: PropTypes.func,
  validationError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
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
  viewOnly: PropTypes.bool,
  tearSheetView: PropTypes.bool
};
