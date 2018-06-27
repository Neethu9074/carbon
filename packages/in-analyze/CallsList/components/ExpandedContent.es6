import React from 'react';

import EditApplicationFilterDialog from 'in-analyze/Filter/Dialogs/EditApplicationFilterDialog';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import EditFilterDialog from 'in-analyze/Filter/Dialogs/EditFilterDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import FilterPlaceholder from 'in-analyze/Filter/FilterPlaceholder';
import ToggleFilter from 'in-analyze/Filter/ToggleFilter';
import FilterGroup from 'in-analyze/Filter/FilterGroup';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';
import Filter from 'in-analyze/Filter';
import theme from 'in-themes/theme';

import locals from './ExpandedContent.mless';

export default function ExpandedContent({
  filters,
  onAddFilter,
  onGroupToggled,
  onUpdateTagFilter,
  onRemoveTagFilter,
  onUpdateApplicationTag,
  onResetApplicationFilter
}) {
  const application = filters.getIn(['applicationFilter', APPLICATION.id]);
  const service = filters.getIn(['applicationFilter', SERVICE.id]);
  const endpoint = filters.getIn(['applicationFilter', ENDPOINT.id]);

  return (
    <div className={locals.content}>
      <FilterGroup className={locals.filtersFilterGroup} name="Filters">
        <div className={locals.filterListing}>
          <AppendAnd>
            <ApplicationFilterOrPlaceholder
              filter={application}
              filterPreset={APPLICATION}
              placeholderText="Application"
              onUpdateApplicationTag={onUpdateApplicationTag}
              onResetApplicationFilter={onResetApplicationFilter}
            />
          </AppendAnd>
          <AppendAnd>
            <ApplicationFilterOrPlaceholder
              filter={service}
              filterPreset={SERVICE}
              placeholderText="Service"
              onUpdateApplicationTag={onUpdateApplicationTag}
              onResetApplicationFilter={onResetApplicationFilter}
            />
          </AppendAnd>
          <AppendAnd>
            <ApplicationFilterOrPlaceholder
              filter={endpoint}
              isStatic={!service}
              staticToolTip="Please define a service first"
              filterPreset={ENDPOINT}
              placeholderText="Endpoint"
              onUpdateApplicationTag={onUpdateApplicationTag}
              onResetApplicationFilter={onResetApplicationFilter}
            />
          </AppendAnd>
        </div>

        <div className={locals.filterListing}>
          {filters.get('tagFilter').map((tag, i) => (
            <AppendAnd key={i}>
              <Filter
                className={locals.filter}
                key={i}
                title={tag.get('name')}
                icon={tag.get('icon')}
                onRemove={() => onRemoveTagFilter(tag.get('id'))}
                onClick={() =>
                  setActiveDialog(
                    <EditFilterDialog tag={tag.toJS()} onSave={_tag => onUpdateTagFilter(tag.get('id'), _tag)} />
                  )
                }
              >
                {tag.get('value')}
              </Filter>
            </AppendAnd>
          ))}

          <FilterPlaceholder className={locals.filter} onClick={onAddFilter}>
            Filter
          </FilterPlaceholder>
        </div>
      </FilterGroup>

      <FilterGroup name="Group">
        <ToggleFilter size="compact" onClick={onGroupToggled} isEnabled={filters.get('group')}>
          {filters.getIn(['group', 'label'], 'Trace Name')}
        </ToggleFilter>
      </FilterGroup>
    </div>
  );
}

function ApplicationFilterOrPlaceholder({
  filter,
  filterPreset,
  isStatic,
  staticToolTip,
  placeholderText,
  onResetApplicationFilter,
  onUpdateApplicationTag
}) {
  if (isStatic) {
    return (
      <Tooltip themeStyle="light" content={staticToolTip}>
        <FilterPlaceholder className={locals.filter} isStatic={isStatic}>
          {placeholderText}
        </FilterPlaceholder>
      </Tooltip>
    );
  }
  function onClicked() {
    setActiveDialog(
      <EditApplicationFilterDialog
        tag={{ name: filterPreset.name, value: filter ? filter.get('value', '') : '' }}
        onSave={_tag => onUpdateApplicationTag(filterPreset.id, _tag, filterPreset.icon)}
      />
    );
  }
  if (filter) {
    return (
      <Filter
        className={locals.filter}
        title={filterPreset.label}
        icon={filterPreset.icon}
        onRemove={() => onResetApplicationFilter(filter.get('id'))}
        onClick={onClicked}
      >
        {filter.get('value')}
      </Filter>
    );
  }
  return (
    <FilterPlaceholder className={locals.filter} onClick={onClicked}>
      {placeholderText}
    </FilterPlaceholder>
  );
}

function AppendAnd({ children }) {
  return (
    <div className={locals.flexWrapper}>
      {children}
      <Pill className={locals.andIndicator} color={theme.lib.colors.N400}>
        AND
      </Pill>
    </div>
  );
}
