import { fromJS } from 'immutable';
import React from 'react';

import {
  applicationFilter as applicationFilterMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import QueryBuilderWorkspace from 'in-analyze/CallsList/components/QueryBuilderWorkspace';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import { createFilter } from 'in-analyze/CallsList/filterBuilder';
import EditGroupDialog from 'in-analyze/Dialogs/EditGroupDialog';
import { SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import Controls from 'in-analyze/CallsList/components/Controls';
import { number } from 'in-services/formatters/number';

import locals from './AnalyzeHeader.mless';

export default function AnalyzeHeader({ filters, onChangeFilters, totalNumberOfCalls }) {
  return (
    <div className={locals.analyzeHeader}>
      <MaxWidthFullscreenContainer>
        <div className={locals.heading}>
          <div className={locals.titleWrapper}>
            <h2 className={locals.title}>Analyze</h2>
            {totalNumberOfCalls && (
              <span className={locals.numberOfCalls}>{number.compact(totalNumberOfCalls)} Calls</span>
            )}
          </div>
          <Controls filters={filters} onResetClicked={() => clearFilters(onChangeFilters)} />
        </div>
      </MaxWidthFullscreenContainer>

      <div className={locals.filterRow}>
        <MaxWidthFullscreenContainer>
          <QueryBuilderWorkspace
            filters={filters}
            onUpdateTagFilter={(id, tag) => onUpdateTagFilter(id, tag, filters, onChangeFilters)}
            onRemoveTagFilter={id => onRemoveTagFilter(id, filters, onChangeFilters)}
            onUpdateApplicationTag={(id, tag) => onUpdateApplicationTag(id, tag, filters, onChangeFilters)}
            onResetApplicationFilter={id => onResetApplicationFilter(id, filters, onChangeFilters)}
            onAddFilter={() => onAddFilter(filters, onChangeFilters)}
            onAddGroup={() => onUpdateGroup(onChangeFilters)}
            onUpdateGroup={group => onUpdateGroup(onChangeFilters, group)}
            onRemoveGroup={() => onRemoveGroup(onChangeFilters)}
          />
        </MaxWidthFullscreenContainer>
      </div>
    </div>
  );
}

function onAddFilter(filters, onChangeFilters) {
  const tag = createFilter({});

  setActiveDialog(
    <EditFilterDialog
      tag={tag}
      onSave={_tag => {
        tag.name = _tag.name;
        tag.value = _tag.value;
        const newState = {};
        newState[tagFilterMatrixParameter] = filters
          .get('tagFilter')
          .push(fromJS(tag))
          .toJS();
        onChangeFilters(newState);
      }}
    />
  );
}

function onUpdateTagFilter(id, tag, filters, onChangeFilters) {
  const tagFilter = filters.get('tagFilter').toJS();
  tagFilter[findTagIndexById(tagFilter, id)] = createFilter({
    id,
    name: tag.name,
    value: tag.value
  });

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeFilters(newState);
}

function onRemoveTagFilter(id, filters, onChangeFilters) {
  const tagFilter = filters.get('tagFilter').toJS();
  tagFilter.splice(findTagIndexById(tagFilter, id), 1);

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeFilters(newState);
}

function onUpdateApplicationTag(id, tag, filters, onChangeFilters) {
  const applicationFilter = filters.get('applicationFilter').toJS();
  applicationFilter[id] = { name: tag.name, value: tag.value };

  if (id === SERVICE.id) {
    const hasValueChanged = filters.getIn(['applicationFilter', SERVICE.id, 'value']) !== tag.value;
    if (hasValueChanged) {
      applicationFilter[ENDPOINT.id] = null;
    }
  }

  const newState = {};
  newState[applicationFilterMatrixParameter] = applicationFilter;
  onChangeFilters(newState);
}

function onResetApplicationFilter(id, filters, onChangeFilters) {
  const applicationFilter = filters.get('applicationFilter').toJS();
  applicationFilter[id] = null;

  if (id === SERVICE.id) {
    applicationFilter[ENDPOINT.id] = null;
  }

  const newState = {};
  newState[applicationFilterMatrixParameter] = applicationFilter;
  onChangeFilters(newState);
}

function onUpdateGroup(onChangeFilters, group) {
  setActiveDialog(
    <EditGroupDialog
      group={group ? group.toJS() : createFilter({})}
      onSave={_group => {
        const newState = {};

        newState[groupByMatrixParameter] = { name: _group.name, value: _group.value };
        onChangeFilters(newState);
      }}
      onRemove={
        group
          ? () => {
              const newState = {};
              newState[groupByMatrixParameter] = null;
              onChangeFilters(newState);
            }
          : null
      }
    />
  );
}

function onRemoveGroup(onChangeFilters) {
  const newState = {};
  newState[groupByMatrixParameter] = null;
  onChangeFilters(newState);
}

function clearFilters(onChangeFilters) {
  const newState = {};
  newState[groupByMatrixParameter] = null;
  newState[tagFilterMatrixParameter] = [];
  newState[applicationFilterMatrixParameter] = {};
  onChangeFilters(newState);
}

function findTagIndexById(tags, id) {
  for (let i = 0; i < tags.length; i++) {
    const filter = tags[i];
    if (filter.id === id) {
      return i;
    }
  }
}
