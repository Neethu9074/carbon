import React from 'react';

import EditApplicationFilterDialog from 'in-analyze/Filter/Dialogs/EditApplicationFilterDialog';
import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import EditFilterDialog from 'in-analyze/Filter/Dialogs/EditFilterDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import FilterPlaceholder from 'in-analyze/Filter/FilterPlaceholder';
import StaticFilter from 'in-analyze/Filter/StaticFilter';
import ToggleFilter from 'in-analyze/Filter/ToggleFilter';
import FilterGroup from 'in-analyze/Filter/FilterGroup';
import SvgIcon from 'in-components/SvgIcon';
import Filter from 'in-analyze/Filter';

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
      <FilterGroup name="Source">
        <StaticFilter size="compact">Calls</StaticFilter>
      </FilterGroup>

      <FilterGroup className={locals.filtersFilterGroup} name="Filters">
        <div className={locals.filterListing}>
          <ApplicationFilterOrPlaceholder
            filter={application}
            filterPreset={APPLICATION}
            placeholderText="Application"
            onUpdateApplicationTag={onUpdateApplicationTag}
            onResetApplicationFilter={onResetApplicationFilter}
          />
          <ApplicationFilterOrPlaceholder
            filter={service}
            filterPreset={SERVICE}
            placeholderText="Service"
            onUpdateApplicationTag={onUpdateApplicationTag}
            onResetApplicationFilter={onResetApplicationFilter}
          />
          <ApplicationFilterOrPlaceholder
            filter={endpoint}
            isStatic={!service}
            filterPreset={ENDPOINT}
            placeholderText="Endpoint"
            onUpdateApplicationTag={onUpdateApplicationTag}
            onResetApplicationFilter={onResetApplicationFilter}
          />

          {filters.get('tagFilter').map((tag, i) => (
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
          ))}
          <AddFilterButton onClick={onAddFilter} />
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
  placeholderText,
  onResetApplicationFilter,
  onUpdateApplicationTag
}) {
  if (isStatic) {
    return (
      <FilterPlaceholder className={locals.filter} isStatic={isStatic} icon={filterPreset.icon}>
        {placeholderText}
      </FilterPlaceholder>
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
        removeIcon="lib_actions_revert"
        onRemove={() => onResetApplicationFilter(filter.get('id'))}
        onClick={onClicked}
      >
        {filter.get('value')}
      </Filter>
    );
  }
  return (
    <FilterPlaceholder className={locals.filter} icon={filterPreset.icon} onClick={onClicked}>
      {placeholderText}
    </FilterPlaceholder>
  );
}

function AddFilterButton({ onClick }) {
  return (
    <SvgIcon
      className={locals.addFilterIcon}
      type="lib_openclose_add_circle"
      width={24}
      height={24}
      onClick={onClick}
    />
  );
}
