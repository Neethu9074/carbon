/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect, useState } from 'react';
import React from 'react';

import {
  CarbonPopoverContent as PopoverContent,
  CarbonContainedList as ContainedList,
  CarbonPopover as Popover,
  CarbonContainedListItem as ContainedListItem,
  CarbonIconButton as IconButton,
  SvgIcon,
  CarbonButton as Button,
  CarbonExpandableSearch as ExpandableSearch,
  Typography,
  CarbonLayer as Layer,
  CarbonEmptyState as EmptyState
} from '@instana/components';
import { Group, Result, SavedFilter } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { DeleteFilterModal } from 'in-applications/analyze/components/SaveFilters/DeleteFilterModal';
import { RenderIcon } from 'in-applications/analyze/components/SaveFilters/RenderIcon';
import { setSelectedFilter } from 'in-applications/analyze/utils/filterUtils';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { getSavedFilters } from 'in-applications/api/filters';
import { isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-applications/analyze/components/SaveFilters/SavedFilters.mless';

interface SavedFiltersProps {
  setUrlState: ({ groupBy, formModel }: { groupBy: Group | {}; formModel: FormModelElement[] }) => void;
}

export const SavedFilters = ({ setUrlState }: SavedFiltersProps): JSX.Element => {
  const [isFiltersListOpen, setIsFiltersListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SavedFilter[]>([]);

  const result = useObservable(() => getSavedFilters(), []) as Result<SavedFilter[]>;

  useDisabledBodyScroll(isFiltersListOpen);

  useEffect(() => {
    const fetchedData = result?.data ?? [];
    if (!isLoading(result)) {
      if (searchTerm) {
        setSearchResults(
          fetchedData.filter((listItem: SavedFilter) => listItem.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      } else {
        setSearchResults(fetchedData);
      }
    }
  }, [result, searchTerm]);

  const handleSearch = (event: { target: HTMLInputElement; type: 'change' }) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (filter: SavedFilter) => {
    setSelectedFilter('edit', filter);
    setIsFiltersListOpen(false);
  };

  const handleClick = (filter: SavedFilter) => {
    const tagFilterExpression = fromBackendModel(filter.tagFilterExpression) as FormModelElement[];
    setUrlState({
      formModel: tagFilterExpression,
      ...(filter?.group?.tag
        ? {
            groupBy: {
              groupbyTag: filter.group.tag,
              groupbyTagEntity: filter.group.entity
            }
          }
        : {
            groupBy: {}
          })
    });
    setSelectedFilter('click', filter);
    setIsFiltersListOpen(false);
  };

  const handleDelete = (filter: SavedFilter) => {
    const { id, name } = filter;
    addActiveDialog(<DeleteFilterModal filterId={id} filterName={name} />);
  };

  const handleClose = () => {
    setIsFiltersListOpen(false);
  };
  const itemActions = (item: SavedFilter) => {
    return (
      <>
        <IconButton label="edit" kind="ghost" onClick={() => handleEdit(item)}>
          <SvgIcon type="lib_actions_edit" size="s" />
        </IconButton>
        <IconButton label="delete" kind="ghost" onClick={() => handleDelete(item)}>
          <SvgIcon type="lib_actions_delete" size="s" />
        </IconButton>
      </>
    );
  };

  return (
    <Layer>
      <Popover open={isFiltersListOpen} align="bottom-end" onRequestClose={handleClose}>
        <Button
          onClick={() => setIsFiltersListOpen(!isFiltersListOpen)}
          kind="tertiary"
          aria-expanded={isFiltersListOpen}
          aria-haspopup
          renderIcon={() => (
            <RenderIcon size="s" type={isFiltersListOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} />
          )}
          size="sm"
        >
          {t('in-applications:analyze.filters')}
        </Button>
        <PopoverContent className={locals.popoverContent}>
          <ContainedList
            label={t('in-applications:analyze.savedFilters')}
            action={
              <ExpandableSearch
                placeholder="Filter"
                labelText="Search"
                value={searchTerm}
                onChange={handleSearch}
                closeButtonLabelText="Clear search input"
                size="sm"
              />
            }
            className={locals.containedList}
            size="sm"
          >
            {result?.data?.length === 0 ? (
              <ContainedListItem>
                <EmptyState
                  icon="lib_carbon_empty_state_not_found"
                  className={locals.emptyState}
                  text={t('in-applications:analyze.addSomeFilters')}
                  title={t('in-applications:analyze.noSavedFilters')}
                />
              </ContainedListItem>
            ) : searchResults.length ? (
              searchResults.map((listItem, key) => (
                <ContainedListItem
                  action={itemActions(listItem)}
                  key={key}
                  className={locals.listItem}
                  onClick={() => handleClick(listItem)}
                >
                  <Typography variant="body-01">{listItem.name}</Typography>
                </ContainedListItem>
              ))
            ) : (
              <ContainedListItem>
                <EmptyState
                  icon="lib_carbon_empty_state_not_found"
                  className={locals.emptyState}
                  title={t('in-applications:analyze.zeroResults', { searchTerm })}
                  text={t('in-applications:analyze.tryAdjustingSearch')}
                />
              </ContainedListItem>
            )}
          </ContainedList>
        </PopoverContent>
      </Popover>
    </Layer>
  );
};
