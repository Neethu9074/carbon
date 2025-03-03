/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ChangeEvent, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import React from 'react';

import {
  CarbonPopoverContent as PopoverContent,
  CarbonPopover as Popover,
  CarbonButton as Button,
  CarbonCheckbox as Checkbox,
  CarbonTextInput as TextInput,
  Typography,
  CarbonStack as Stack,
  CarbonForm as Form,
  CarbonLayer as Layer
} from '@instana/components';
import { Group, Result, SavedFilter, SavedFilterGroup, TagFilterExpressionElementUnion } from '@instana/types';

import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { selectedFilter$, setSelectedFilter } from 'in-applications/analyze/utils/filterUtils';
import { RenderIcon } from 'in-applications/analyze/components/SaveFilters/RenderIcon';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createFilter, updateFilter } from 'in-applications/api/filters';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-applications/analyze/components/SaveFilters/SaveFilterPopover.mless';

interface Props {
  backendQueryModel: TagFilterExpressionElementUnion;
  formModel: FormModelElement[];
  group: Group;
}

export const SaveFilterPopover = ({ backendQueryModel, formModel, group }: Props): JSX.Element => {
  const maxLength = 75;
  const hasGroup = !!Object.keys(group).length;
  const [open, setOpen] = useState<boolean>(false);
  const [includeGroup, setIncludeGroup] = useState<boolean>(hasGroup);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [invalidText, setInvalidText] = useState<string>('');
  const [isEdit, setIsEdit] = useState(false);
  const [filter, setFilter] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    const subscription = selectedFilter$.subscribe(
      ({ action, filter }: { action: string; filter: Partial<SavedFilter> | null }) => {
        const hasFiltersOrGrouping = formModel.length || Boolean(group.groupbyTag);
        const isEditing = action === 'edit';

        if (isEditing) {
          setIsEdit(true);
          setOpen(true);
          setIsSaveDisabled(false);
        } else if (hasFiltersOrGrouping && action === 'click') {
          if (!filter) return;
          const hasChanged = hasFilterOrGroupChanged(
            fromBackendModel(filter.tagFilterExpression),
            formModel,
            filter.group!,
            group
          );
          setIsSaveDisabled(!hasChanged);
        } else {
          setIsSaveDisabled(!hasFiltersOrGrouping);
        }
        setFilter(
          (filter as SavedFilter) ?? {
            id: '',
            name: ''
          }
        );
      }
    );

    return () => subscription.dispose();
  }, [formModel, group]);

  useEffect(() => {
    setIncludeGroup(hasGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  const handleClose = () => {
    setSelectedFilter('', {
      id: '',
      name: ''
    });
    setOpen(false);
    setIsEdit(false);
  };

  const handleResponse = (response: Result<any>) => {
    if (response.data !== undefined) {
      handleClose();
      displaySuccessMessage(
        isEdit
          ? t('in-applications:analyze.filtersUpdatedTitle', { filterName: filter.name })
          : t('in-applications:analyze.filtersSavedTitle'),
        isEdit ? '' : t('in-applications:analyze.filtersSavedMessage', { filterName: filter.name })
      );
    } else if (response.errors) {
      setInvalidText(response.errors[0].message);
    }
  };

  const handleSave = () => {
    const payload = {
      name: filter.name,
      tagFilterExpression: backendQueryModel,
      ...(hasGroup && {
        group: { tag: group.groupbyTag, entity: group.groupbyTagEntity ?? NOT_APPLICABLE } as SavedFilterGroup
      })
    };

    const apiCall$ = isEdit
      ? updateFilter({ filterId: filter.id, payload: { ...payload, id: filter.id } })
      : createFilter(payload);

    apiCall$.subscribe((response: Result<any>) => {
      if (!isLoading(response)) {
        handleResponse(response);
      }
    });
  };

  const handleSaveButtonClick = () => {
    setSelectedFilter('', {
      id: '',
      name: ''
    });
    setInvalidText('');
    setOpen(!open);
    setIsEdit(false);
  };

  const handleFilterNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      name: e.target.value
    }));
    setInvalidText('');
  };
  return (
    <Popover open={open} align="bottom-end" onRequestClose={handleClose}>
      <Button
        disabled={isSaveDisabled}
        kind="ghost"
        icon="lib_save"
        onClick={handleSaveButtonClick}
        size="sm"
        renderIcon={() => <RenderIcon size="s" type={'lib_save'} />}
      >
        {t('in-analyze:components.filterBar.save')}
      </Button>
      <PopoverContent className={locals.saveFilterPopoverContainer}>
        <Form aria-label="save filter form">
          <Stack gap={5}>
            <div>
              <Typography variant="heading-compact-01">
                {isEdit ? t('in-applications:analyze.editFilterTitle') : t('in-applications:analyze.saveFiltersTitle')}
              </Typography>

              <p className={locals.subTitle}>
                {isEdit
                  ? t('in-applications:analyze.editFilterDescription')
                  : t('in-applications:analyze.saveFiltersDescription')}
              </p>
            </div>
            <div className={locals.textInputContainer}>
              <span className={locals.charactercounter}>
                {filter.name.length}/{maxLength}
              </span>
              <Layer>
                <TextInput
                  id="filterName"
                  labelText="Name"
                  placeholder={t('in-applications:analyze.enterFilterName')}
                  size="sm"
                  type="text"
                  value={filter.name}
                  maxLength={maxLength}
                  className={locals.inputClass}
                  invalidText={invalidText}
                  invalid={!!invalidText}
                  onChange={handleFilterNameChange}
                />
              </Layer>
            </div>
            {!isEdit && (
              <Checkbox
                labelText={t('in-applications:analyze.includeGroup')}
                id="includeGroup"
                checked={includeGroup}
                disabled={!hasGroup}
                onChange={e => {
                  setIncludeGroup(e.target.checked);
                }}
              />
            )}
            <div className={locals.buttonWrapper}>
              <Button
                kind="secondary"
                size="sm"
                onClick={handleClose}
                renderIcon={() => <RenderIcon size="s" type={'lib_openclose_cancel'} />}
              >
                {t('in-applications:buttonCancel')}
              </Button>
              <Button
                disabled={!filter.name.trim().length}
                kind="primary"
                size="sm"
                onClick={handleSave}
                renderIcon={() => <RenderIcon size="s" type={'lib_save'} />}
              >
                {t('in-applications:buttonSave')}
              </Button>
            </div>
          </Stack>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

const displaySuccessMessage = (title: string, content: string) => {
  addMessage(
    {
      type: 'success',
      timeout: 4000,
      title,
      content
    },
    'savefilters-success'
  );
};

const hasFilterOrGroupChanged = (
  selectedTagFilterExpression: FormModelElement[],
  filterInQueryBuilder: FormModelElement[],
  selectedGroup: SavedFilterGroup,
  groupInQueryBuilder: Group
): boolean => {
  const hasFilterChanged = !isEqual(selectedTagFilterExpression, filterInQueryBuilder);
  const hasGroupChanged = hasGroupStateChanged(selectedGroup, groupInQueryBuilder);

  return hasFilterChanged || hasGroupChanged;
};

const hasGroupStateChanged = (selectedGroup: SavedFilterGroup, groupInQueryBuilder: Group) => {
  const isGroupEmpty = selectedGroup.tag == null;
  const isGroupQueryBuilderEmpty = !Object.keys(groupInQueryBuilder).length;
  return !(
    (isGroupEmpty && isGroupQueryBuilderEmpty) ||
    (selectedGroup?.tag === groupInQueryBuilder?.groupbyTag &&
      (selectedGroup.entity === groupInQueryBuilder?.groupbyTagEntity ||
        (selectedGroup.entity === NOT_APPLICABLE && !groupInQueryBuilder?.groupbyTagEntity)))
  );
};
