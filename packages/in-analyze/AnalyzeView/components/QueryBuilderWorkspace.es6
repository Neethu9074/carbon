import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import EditGroupDialog from 'in-analyze/Dialogs/EditGroupDialog';
import { createTracker } from 'in-services/tracking/mixpanel';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';

import locals from './QueryBuilderWorkspace.mless';

const groupAddedTracker = createTracker('analyze.group.added');
const groupChangedTracker = createTracker('analyze.group.changed');
const groupRemovedTracker = createTracker('analyze.group.removed');

export default function QueryBuilderWorkspace(props) {
  const { filters, onChangeAnalyzeConfig, removeTagFilter, upsertTagFilter } = props;
  const group = filters.get('group');

  return (
    <Fragment>
      <Sticky
        header={
          <div>
            <QuickFilterBar {...props} />
          </div>
        }
      >
        <div className={locals.filterRow}>
          <MaxWidthFullscreenContainer className={locals.filterRowWrapper}>
            <TagFilterList
              tagFilters={filters
                .get('tagFilter')
                .toJS()
                .map(tag => ({
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
                        onSave={_tag => upsertTagFilter(_tag)}
                        onRemove={() => removeTagFilter(tag.name)}
                        removeItemName="Filter"
                      />
                    );
                  },
                  onRemove: () => removeTagFilter(tag.name)
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
      </Sticky>
    </Fragment>
  );
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
