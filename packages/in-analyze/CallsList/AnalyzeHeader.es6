import { withState } from 'recompose';
import { fromJS } from 'immutable';
import React from 'react';

import {
  applicationFilter as applicationFilterMatrixParameter,
  tagFilter as tagFilterMatrixParameter,
  groupBy as groupByMatrixParameter
} from 'in-analyze/navigation/matrix';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ExpandedContent from 'in-analyze/CallsList/components/ExpandedContent';
import EditFilterDialog from 'in-analyze/Filter/Dialogs/EditFilterDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { createFilter } from 'in-analyze/CallsList/filterBuilder';
import { SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import Controls from 'in-analyze/CallsList/components/Controls';
import groups from 'in-analyze/CallsList/groups';

import locals from './AnalyzeHeader.mless';

export default withState('isExpanded', 'setIsExpanded', true)(AnalyzeHeader);
function AnalyzeHeader({ filters, onChangeFilters, totalNumberOfCalls }) {
  return (
    <div className={locals.analyzeHeader}>
      <MaxWidthFullscreenContainer>
        <div className={locals.heading}>
          <div className={locals.titleWrapper}>
            <h2 className={locals.title}>Analyze</h2>
            {totalNumberOfCalls && <span className={locals.numberOfCalls}>{totalNumberOfCalls} Calls</span>}
          </div>
          <Controls filters={filters} onResetClicked={() => clearFilters(onChangeFilters)} />
        </div>
      </MaxWidthFullscreenContainer>

      <div className={locals.filterRow}>
        <MaxWidthFullscreenContainer>
          <ExpandedContent
            filters={filters}
            onUpdateTagFilter={(id, tag) => onUpdateTagFilter(id, tag, filters, onChangeFilters)}
            onRemoveTagFilter={id => onRemoveTagFilter(id, filters, onChangeFilters)}
            onUpdateApplicationTag={(id, tag) => onUpdateApplicationTag(id, tag, filters, onChangeFilters)}
            onResetApplicationFilter={id => onResetApplicationFilter(id, filters, onChangeFilters)}
            onAddFilter={() => onAddFilter(filters, onChangeFilters)}
            onGroupToggled={isEnabled => onGroupToggled(isEnabled, onChangeFilters)}
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
        onChangeFilters({
          tagFilter: filters
            .get('tagFilter')
            .push(fromJS(tag))
            .toJS()
        });
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

  onChangeFilters({ tagFilter });
}

function onRemoveTagFilter(id, filters, onChangeFilters) {
  const tagFilter = filters.get('tagFilter').toJS();
  tagFilter.splice(findTagIndexById(tagFilter, id), 1);

  onChangeFilters({ tagFilter });
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

  onChangeFilters({ applicationFilter });
}

function onResetApplicationFilter(id, filters, onChangeFilters) {
  const applicationFilter = filters.get('applicationFilter').toJS();
  applicationFilter[id] = null;

  if (id === SERVICE.id) {
    applicationFilter[ENDPOINT.id] = null;
  }

  onChangeFilters({ applicationFilter });
}

function onGroupToggled(isEnabled, onChangeFilters) {
  const newState = {};
  newState[groupByMatrixParameter] = isEnabled ? groups.name : null;
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
