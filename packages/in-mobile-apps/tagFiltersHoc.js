/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withProps } from 'recompose';

import { noop } from 'in-services/util/function';

export const tagFilterManipulators = ({ tagFiltersTrackers }) =>
  withProps(({ tagFilters, setTagFilters, group }) => {
    const trackedSetTagFilters = newTagFilters => {
      setTagFilters(newTagFilters);
      tagFiltersTrackers.set({
        filters: newTagFilters,
        group: group
      });
    };

    return {
      setTagFilters: trackedSetTagFilters,
      removeTagFilter(name, operator) {
        setTagFilters(tagFilters.filter(f => f.name !== name || (operator != null && f.operator !== operator)));
        const before = tagFilters.filter(f => f.name === name && (operator == null || f.operator === operator));
        if (before.length > 0) {
          tagFiltersTrackers.remove({
            name,
            filter: before[0],
            group: group
          });
        } else {
          tagFiltersTrackers.remove({
            name,
            group: group
          });
        }
      },
      addTagFilter(newTagFilter) {
        setTagFilters(tagFilters.concat(newTagFilter));
        tagFiltersTrackers.add({
          name: newTagFilter.name,
          filter: newTagFilter,
          group: group
        });
      },
      upsertTagFilter(newTagFilter) {
        setTagFilters(
          tagFilters
            .filter(f => f.name !== newTagFilter.name || f.operator !== newTagFilter.operator)
            .concat(newTagFilter)
        );
        const before = tagFilters.filter(f => f.name === newTagFilter.name && f.operator === newTagFilter.operator);
        if (before.length > 0) {
          tagFiltersTrackers.change({
            before: before[0],
            after: newTagFilter,
            group: group
          });
        } else {
          tagFiltersTrackers.add({
            filter: newTagFilter,
            group: group
          });
        }
      },
      clearTagFilters() {
        setTagFilters([]);
        tagFiltersTrackers.clear({
          group: group
        });
      }
    };
  });

export const noopTagFilterTrackers = {
  add: noop,
  change: noop,
  remove: noop,
  clear: noop,
  set: noop
};
