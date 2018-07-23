import React from 'react';

import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import QueryBuilderWorkspace from 'in-analyze/Analyze/components/QueryBuilderWorkspace';
import QueryBuilderGroup from 'in-analyze/Analyze/components/QueryBuilderGroup';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditGroupDialog from 'in-analyze/Dialogs/EditGroupDialog';
import Controls from 'in-analyze/Analyze/components/Controls';
import { createFilter } from 'in-analyze/filterBuilder';
import { number } from 'in-services/formatters/number';

import locals from './AnalyzeHeader.mless';

export default function AnalyzeHeader({ filters, onChangeFilters, totalNumberOfCalls }) {
  return (
    <div className={locals.analyzeHeader}>
      <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
        <QueryBuilderGroup renderTitle={() => <h2 className={locals.title}>Analyze</h2>}>
          <span className={locals.callsIndicator}>
            {`${totalNumberOfCalls ? number.compact(totalNumberOfCalls) + ' ' : ''}Calls`}
          </span>
        </QueryBuilderGroup>

        <Controls filters={filters} onResetClicked={() => clearFilters(onChangeFilters)} />

        <QueryBuilderWorkspace
          filters={filters}
          onUpdateTagFilter={(id, tag) => onUpdateTagFilter(id, tag, filters, onChangeFilters)}
          onRemoveTagFilter={id => onRemoveTagFilter(id, filters, onChangeFilters)}
          onAddTagFilter={tag => onAddTagFilter(tag, filters, onChangeFilters)}
          onAddGroup={() => onUpdateGroup(filters, onChangeFilters)}
          onUpdateGroup={group => onUpdateGroup(filters, onChangeFilters, group)}
          onRemoveGroup={() => onRemoveGroup(onChangeFilters)}
        />
      </MaxWidthFullscreenContainer>
    </div>
  );
}

function onAddTagFilter(tag, filters, onChangeFilters) {
  const tagFilter = filters.get('tagFilter').toJS();

  tagFilter.push(
    createFilter({
      id: tag.id,
      name: tag.name,
      value: tag.value,
      operator: tag.operator
    })
  );

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeFilters(newState);
}

function onUpdateTagFilter(id, tag, filters, onChangeFilters) {
  const tagFilter = filters.get('tagFilter').toJS();
  tagFilter[findTagIndexById(tagFilter, id)] = createFilter({
    id,
    name: tag.name,
    value: tag.value,
    operator: tag.operator
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

function onUpdateGroup(filters, onChangeFilters, group) {
  setActiveDialog(
    <EditGroupDialog
      filters={filters}
      name={group ? group.get('name') : ''}
      value={group ? group.get('value') : ''}
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
