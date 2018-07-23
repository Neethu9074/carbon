import React from 'react';

import QueryBuilderGroup from 'in-analyze/Analyze/components/QueryBuilderGroup';
import TagFilterList from 'in-analyze/Analyze/components/TagFilterList';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import AddButton from 'in-analyze/Analyze/components/AddButton';
import Group from 'in-analyze/Analyze/components/Group';

import locals from './QueryBuilderWorkspace.mless';

export default function QueryBuilderWorkspace(props) {
  const { filters, onUpdateTagFilter, onRemoveTagFilter, onAddGroup, onUpdateGroup, onRemoveGroup } = props;

  const group = filters.get('group');

  return (
    <div className={locals.workspace}>
      <QueryBuilderGroup renderTitle={() => <div className={locals.filterGroupTitle}>Filter by</div>}>
        <TagFilterList
          {...props}
          onAddTagFilter={() =>
            setActiveDialog(<EditFilterDialog filters={filters} onSave={_tag => props.onAddTagFilter(_tag)} />)
          }
          tagFilters={filters
            .get('tagFilter')
            .toJS()
            .map(tag => ({
              name: tag.name,
              value: tag.value,
              operator: tag.operator,
              secondLevelName: tag.secondLevelName,
              icon: tag.icon,
              progress: 1,
              onClick: () => {
                setActiveDialog(
                  <EditFilterDialog
                    filters={filters}
                    name={tag.name}
                    value={tag.value}
                    operator={tag.operator}
                    secondLevelName={tag.secondLevelName}
                    onSave={_tag => onUpdateTagFilter(tag.id, _tag)}
                    onRemove={() => onRemoveTagFilter(tag.id)}
                    removePostPhrase="Filter"
                  />
                );
              },
              onRemove: () => onRemoveTagFilter(tag.id)
            }))}
        />
      </QueryBuilderGroup>

      <QueryBuilderGroup renderTitle={() => <div className={locals.groupingGroupTitle}>Group by</div>}>
        {group && (
          <div>
            <Group
              name={group.get('value') ? `${group.get('name')}.${group.get('value')}` : group.get('name')}
              onClick={() => onUpdateGroup(group)}
              onRemove={onRemoveGroup}
            />
          </div>
        )}
        {!group && <AddButton onClick={onAddGroup} text="Add group" />}
      </QueryBuilderGroup>
    </div>
  );
}
