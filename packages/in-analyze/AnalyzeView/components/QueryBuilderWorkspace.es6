import React, { Fragment } from 'react';

import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import ResetButton from 'in-analyze/AnalyzeView/components/ResetButton';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import EditGroupDialog from 'in-analyze/Dialogs/EditGroupDialog';
import { createTracker } from 'in-services/tracking/mixpanel';
import { createFilter } from 'in-analyze/filterBuilder';
import { deepCopy } from 'in-services/util/object';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './QueryBuilderWorkspace.mless';

const filterChangedTracker = createTracker('analyze.filter.changed');
const filterRemovedTracker = createTracker('analyze.filter.removed');
const filterClearedTracker = createTracker('analyze.filter.cleared');
const groupAddedTracker = createTracker('analyze.group.added');
const groupChangedTracker = createTracker('analyze.group.changed');
const groupRemovedTracker = createTracker('analyze.group.removed');

export default function QueryBuilderWorkspace(props) {
  const { filters, onChangeAnalyzeConfig } = props;
  const group = filters.get('group');

  return (
    <Fragment>
      <div className={locals.firstRow}>
        <MaxWidthFullscreenContainer className={locals.firstRowMaxWidthFullscreenContainer}>
          <QuickFilterBar {...props} />
          <ResetButton filters={filters} onResetClicked={() => clearFilters(onChangeAnalyzeConfig)} />
        </MaxWidthFullscreenContainer>
      </div>

      <div className={locals.filterRow}>
        <MaxWidthFullscreenContainer className={locals.filterRowWrapper}>
          <TagFilterList
            tagFilters={filters
              .get('tagFilter')
              .toJS()
              .map((tag, i) => ({
                tag,
                onClick: () => {
                  setActiveDialog(
                    <EditFilterDialog
                      filters={filters}
                      keys={getConfigByDataSource(filters.get('dataSource')).filterTagKeys}
                      withExtendedOperators
                      name={tag.name}
                      value={tag.value}
                      operator={tag.operator}
                      secondLevelName={tag.secondLevelName}
                      onSave={_tag => onUpdateTagFilter(i, _tag, filters, onChangeAnalyzeConfig)}
                      onRemove={() => onRemoveTagFilter(i, filters, onChangeAnalyzeConfig)}
                      removeItemName="Filter"
                    />
                  );
                },
                onRemove: () => onRemoveTagFilter(i, filters, onChangeAnalyzeConfig)
              }))}
            defaultFilters={getConfigByDataSource(filters.get('dataSource')).defaultFilters}
          />
        </MaxWidthFullscreenContainer>
      </div>

      <MaxWidthFullscreenContainer>
        <div className={locals.groupRow}>
          {group.get('name') ? (
            <Fragment>
              <span className={locals.groupByLabel}>Grouped by</span>
              <span className={locals.groupByTag}>
                {group.get('value') ? `${group.get('name')}.${group.get('value')}` : group.get('name')}
              </span>
              <Tooltip content="Remove grouping" align="bottomMiddle">
                <SvgIcon
                  className={locals.removeGrouping}
                  aria-label="Remove grouping"
                  type="lib_openclose_cancel"
                  onClick={() => onRemoveGroup(onChangeAnalyzeConfig, group)}
                  width={18}
                  height={18}
                />
              </Tooltip>

              <Button
                kind="primaryv2"
                className={locals.changeGroupLabel}
                onClick={e => {
                  e.preventDefault();
                  onUpdateGroup(filters, onChangeAnalyzeConfig, group);
                }}
              >
                Change Group
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <span className={locals.groupByLabel}>Grouped by</span>
              <Button
                kind="primaryv2"
                onClick={e => {
                  e.preventDefault();
                  onUpdateGroup(filters, onChangeAnalyzeConfig, group);
                }}
              >
                Add Group
              </Button>
            </Fragment>
          )}
        </div>
      </MaxWidthFullscreenContainer>
    </Fragment>
  );
}

function onUpdateTagFilter(index, tag, filters, onChangeAnalyzeConfig) {
  const tagFilter = filters.get('tagFilter').toJS();
  const before = deepCopy(tagFilter[index]);
  tagFilter[index] = createFilter({
    name: tag.name,
    secondLevelName: tag.secondLevelName,
    value: tag.value,
    operator: tag.operator
  });
  filterChangedTracker({ before, after: tagFilter[index] });

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeAnalyzeConfig(newState);
}

function onRemoveTagFilter(index, filters, onChangeAnalyzeConfig) {
  const tagFilter = filters.get('tagFilter').toJS();
  const [removed] = tagFilter.splice(index, 1);
  filterRemovedTracker({ filter: removed });

  onChangeAnalyzeConfig({
    [tagFilterMatrixParameter]: tagFilter
  });
}

function onUpdateGroup(filters, onChangeAnalyzeConfig, group) {
  setActiveDialog(
    <EditGroupDialog
      filters={filters}
      keys={getConfigByDataSource(filters.get('dataSource')).groupTagKeys}
      name={group ? group.get('name') : ''}
      secondLevelName={group ? group.get('value') : ''}
      onSave={_group => {
        if (!group || !group.get('name')) {
          groupAddedTracker({ group: _group.name });
        } else {
          groupChangedTracker({ before: group.get('name'), after: _group.name });
        }

        const newState = {};

        newState[groupByMatrixParameter] = { name: _group.name, value: _group.secondLevelName };
        onChangeAnalyzeConfig(newState);
      }}
    />
  );
}

function onRemoveGroup(onChangeAnalyzeConfig, _group) {
  onChangeAnalyzeConfig({
    [groupByMatrixParameter]: {}
  });
  groupRemovedTracker({ group: _group && _group.get ? _group.get('name') : '' });
}

function clearFilters(onChangeAnalyzeConfig) {
  onChangeAnalyzeConfig({
    [tagFilterMatrixParameter]: []
  });
  filterClearedTracker();
}
