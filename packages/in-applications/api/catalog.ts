/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  ApplicationDataSource,
  CatalogUseCase,
  Result,
  TagCatalog,
  TagTreeLevel,
  TagTreeNodeUnion,
  TimeConfig
} from '@instana/types';
import { Observable } from '@instana/observables';

import { isTroubleshootingModeEnabled$ } from 'in-applications/isTroubleshootingModeEnabled';
import { analyzeSubtracesEnabled } from 'in-services/featureFlags';
import { roundDownToWeek } from 'in-services/util/date';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/catalog';

export const getApplicationTagCatalog =
  ({ dataSource, useCase }: { dataSource: ApplicationDataSource; useCase: CatalogUseCase }) =>
  ({ timeConfig }: { timeConfig: TimeConfig }): Observable<Result<TagCatalog>> => {
    // round down the from timestamp to the beginning of the week to make the caching more efficient
    const from = timeConfig ? roundDownToWeek((timeConfig.to || Date.now()) - timeConfig.windowSize) : undefined;

    return isTroubleshootingModeEnabled$.flatMap(includeInternalTags =>
      http<TagCatalog>({
        method: 'GET',
        maxRetries: 3,
        url: basePath,
        mapToResultObject: true,
        queryParams: {
          from,
          dataSource,
          useCase,
          includeInternalTags
        }
      }).map(filterOutSubtraceTags)
    );
  };

/**
 * Type guard to check if a node is a TagTreeLevel
 * @param node - The node to check
 * @returns True if the node is a TagTreeLevel
 */
const isTagTreeLevel = (node: TagTreeNodeUnion): node is TagTreeLevel =>
  typeof node === 'object' && node !== null && !('tagName' in node);

/**
 * Filters out subtrace tags from a catalog result
 * Subtrace tags are identified by having "subtrace." in their name
 *
 * @param result - The catalog result to filter
 * @returns A new catalog result with subtrace tags filtered out
 */
const filterOutSubtraceTags = (result: Result<TagCatalog>): Result<TagCatalog> => {
  // Early return if no data or if subtrace analysis is enabled
  if (!result.data || analyzeSubtracesEnabled) {
    return result;
  }

  // Filter tags array to remove subtrace tags
  const filteredTags = result.data.tags.filter(tag => !tag.name.includes('subtrace.'));

  // Filter tag tree, only modifying the "Call" level
  const filteredTagTree = result.data.tagTree.map(tagTreeLevel => {
    // Skip levels that aren't "Call"
    if (tagTreeLevel.label !== 'Call') {
      return tagTreeLevel;
    }

    // At this point it is only the Call level, so filter children of that level
    return {
      ...tagTreeLevel,
      children: tagTreeLevel.children.filter(
        tagTreeNode =>
          // Use type guard instead of type assertion for better safety
          isTagTreeLevel(tagTreeNode) || !tagTreeNode.tagName.includes('subtrace.')
      )
    };
  });

  // Return new result with filtered data
  return {
    ...result,
    data: {
      ...result.data,
      tagTree: filteredTagTree,
      tags: filteredTags
    }
  };
};

// Made with Bob
