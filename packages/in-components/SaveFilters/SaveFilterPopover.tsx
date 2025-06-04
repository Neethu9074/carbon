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
import {
  DataSource,
  Group,
  Result,
  SavedFilter,
  SavedFilterArea,
  SavedFilterGroup,
  TagFilterExpressionElementUnion
} from '@instana/types';

import { clickedFilter$, setClickedFilter, cleanTagFilterExpression } from 'in-applications/analyze/utils/filterUtils';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { createFilter, updateFilter } from 'in-applications/api/filters';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { RenderIcon } from 'in-components/SaveFilters/RenderIcon';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-components/SaveFilters/SaveFilterPopover.mless';

interface Props {
  backendQueryModel: TagFilterExpressionElementUnion;
  formModel: FormModelElement[];
  group: Group;
  dataSource: DataSource;
  filterToEdit?: SavedFilter | null;
  result: Result<SavedFilter[]>;
  setFilterToEdit: (filter: SavedFilter | null) => void;
}

export const SaveFilterPopover = ({
  backendQueryModel,
  dataSource,
  filterToEdit,
  formModel,
  group,
  result,
  setFilterToEdit
}: Props): JSX.Element => {
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
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>();
  useDisabledBodyScroll(open);

  useEffect(() => {
    if (!isLoading(result) && result.data) {
      setSavedFilters(result.data);
    }
  }, [result]);

  useEffect(() => {
    if (filterToEdit?.id) {
      setOpen(true);
      setIsEdit(true);
      setFilter(filterToEdit);
    }
  }, [filterToEdit]);

  useEffect(() => {
    const hasFilters = formModel.length > 0;
    const subscription = clickedFilter$.subscribe((filter: Partial<SavedFilter> | null) => {
      if (!filter || filter.area !== dataSource || !hasFilters) {
        setIsSaveDisabled(!hasFilters);
        return;
      }

      const isItemDeleted = savedFilters?.findIndex((item: SavedFilter) => item.id === filter.id) === -1;
      const hasChanged = hasFilterOrGroupChanged(
        fromBackendModel(filter.tagFilterExpression),
        formModel,
        filter.group!,
        group
      );
      setIsSaveDisabled(!(hasChanged || isItemDeleted));
    });

    return () => subscription.dispose();
  }, [formModel, group, dataSource, savedFilters]);

  useEffect(() => {
    setIncludeGroup(hasGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  useEffect(() => {
    if (formModel.length === 0) {
      setClickedFilter(null);
    }
  }, [formModel]);

  const handleClose = () => {
    setFilterToEdit(null);
    setInvalidText('');
    setOpen(false);
    setIsEdit(false);
  };

  const handleResponse = (response: Result<any>) => {
    if (response.data !== undefined) {
      handleClose();
      if (!isEdit) {
        setClickedFilter({
          ...response.data,
          ...{
            group: response.data.group ?? {
              tag: null,
              secondLevelKey: null,
              entity: NOT_APPLICABLE
            }
          }
        });
      }
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
    const payload: Omit<SavedFilter, 'id'> = {
      name: filter.name,
      tagFilterExpression: backendQueryModel,
      ...(includeGroup && {
        group: { tag: group.groupbyTag, entity: group.groupbyTagEntity ?? NOT_APPLICABLE } as SavedFilterGroup
      }),
      area: String(dataSource).toUpperCase() as SavedFilterArea
    };

    const apiCall$ = isEdit
      ? updateFilter({ filterId: filter.id, payload: { ...payload, id: filter.id } })
      : createFilter(payload);

    apiCall$.subscribe((response: Result<SavedFilter>) => {
      if (!isLoading(response)) {
        handleResponse(response);
      }
    });
  };

  const handleSaveButtonClick = () => {
    setFilter({
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
        aria-expanded={open}
        aria-haspopup
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

              <Typography variant="helper-text-01">
                {isEdit
                  ? t('in-applications:analyze.editFilterDescription')
                  : t('in-applications:analyze.saveFiltersDescription')}
              </Typography>
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
  const hasFilterChanged = !isEqual(
    cleanTagFilterExpression(selectedTagFilterExpression),
    cleanTagFilterExpression(filterInQueryBuilder)
  );
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
