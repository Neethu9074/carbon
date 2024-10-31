/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { WebsiteBeaconTagGroup, TagFilter, TagFilterOperator } from '@instana/types';

import { DashboardTagFiltersTracker } from 'in-websites/tracking/segTracker';
import { noop } from 'in-services/util/function';

interface TagFilterManipulator {
  setTagFilters: (v: Array<TagFilter>) => void;
  addTagFilter: (v: TagFilter) => void;
  upsertTagFilter: (v: TagFilter) => void;
  removeTagFilter: (name: string, operator: TagFilterOperator | null) => void;
  clearTagFilters: () => void;
}

export function useTagFilterManipulators(
  tagFiltersTrackers: DashboardTagFiltersTracker,
  tagFilters: Array<TagFilter>,
  setTagFilters: (v: Array<TagFilter>) => void,
  group?: WebsiteBeaconTagGroup
): TagFilterManipulator {
  const trackedSetTagFilters = (newTagFilters: Array<TagFilter>) => {
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
}

export const noopTagFilterTrackers = {
  add: noop,
  change: noop,
  remove: noop,
  clear: noop,
  set: noop
};
