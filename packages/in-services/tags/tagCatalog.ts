/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';
import { isArray } from 'lodash';

import { generateStableHash } from '@instana/utils';
import { Observable } from '@instana/observables';

import { ApiTag, Result, TagCatalog, TagTreeLevel, TagTreeNodeUnion, TagTreeTag, TimeConfig } from 'in-types';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { roundDownToWeek } from 'in-services/util/date';
import { success } from 'in-services/util/result';

export interface TagWithPath extends ApiTag {
  path: TagTreeNodeUnion[];
}

interface TagsByName {
  [tagName: string]: TagWithPath;
}

export interface EnrichedTagCatalog extends TagCatalog {
  __enriched: true;
  tagsByName: TagsByName;
  allTagNames: string[];
  source?: string;
}

// We frequently need to access the tag catalog in ways that would be unoptimized
// given its native structure. We therefore index it in a variety of different
// ways in order to allow faster execution within the components.
export function enrichTagCatalog(tagCatalog: TagCatalog, source?: string): EnrichedTagCatalog {
  // @ts-expect-error We allow users to pass in an enriched tag catalog as well
  // in which case we skip the enrichment phase.
  if (tagCatalog.__enriched) {
    // To allow methods to either work with enriched or un-enriched tag catalogs
    // without a runtime performance impact for optimized code paths.
    return tagCatalog as EnrichedTagCatalog;
  }

  const tagsWithPath = resolveTagsFromTree(tagCatalog.tagTree);
  const tagsByName = tagCatalog.tags.reduce((agg, tag) => {
    agg[tag.name] = { ...tag, path: tagsWithPath[tag.name] };
    tag.aliases?.forEach(alias => {
      agg[alias] = { ...tag, path: tagsWithPath[tag.name] };
    });
    return agg;
  }, {} as TagsByName);

  return {
    ...tagCatalog,
    __enriched: true,
    tagsByName,
    allTagNames: Object.keys(tagsByName),
    source
  };
}

export function mergeTagCatalogs(left: TagCatalog, right?: TagCatalog): EnrichedTagCatalog {
  if (!right) {
    return enrichTagCatalog(left);
  }

  let tagTree: TagTreeLevel[] = [];
  let tagsByName: { [tagName: string]: ApiTag } = {};
  concatTagTrees(tagTree, left.tagTree);
  concatTagTrees(tagTree, right.tagTree);
  addTags(tagsByName, left.tags);
  addTags(tagsByName, right.tags);

  return enrichTagCatalog({ tagTree, tags: Object.values(tagsByName) });
}

function concatTagTrees(target: TagTreeNodeUnion[], tagTree: TagTreeNodeUnion[]) {
  for (const node of tagTree) {
    if (isLevel(node)) {
      const level = getOrAddLevel(target, node);
      concatTagTrees(level.children, node.children);
    } else if (isTag(node)) {
      addTagIfAbsent(target, node);
    }
  }
}

function getOrAddLevel(target: TagTreeNodeUnion[], node: TagTreeLevel) {
  const existingLevel = target.find(existingLevel => node.label === existingLevel.label);
  let level: TagTreeLevel;
  if (existingLevel && isLevel(existingLevel)) {
    level = existingLevel;
  } else {
    if (__DEV__) {
      invariant(!existingLevel, 'Incompatible tag catalogs');
    }
    level = {
      ...node,
      children: []
    };
    target.push(level);
  }
  return level;
}

function addTagIfAbsent(target: TagTreeNodeUnion[], node: TagTreeTag) {
  if (!target.find(existingTag => node.label === existingTag.label)) {
    target.push(node);
  }
}

function addTags(tags: { [tagName: string]: ApiTag }, tagsToAdd: ApiTag[]) {
  for (const tag of tagsToAdd) {
    tags[tag.name] = tag;
  }
}

function isLevel(node: TagTreeNodeUnion): node is TagTreeLevel {
  return 'children' in node && isArray(node.children);
}

function isTag(node: TagTreeTag): node is TagTreeTag {
  return 'tagName' in node;
}

interface ResolvedTagPaths {
  [tagName: string]: TagTreeNodeUnion[];
}

function resolveTagsFromTree(tree: TagTreeLevel[]): ResolvedTagPaths {
  const resolvedTags: ResolvedTagPaths = {};
  if (tree) {
    for (const level of tree) {
      resolveNode(level, resolvedTags, []);
    }
  }
  return resolvedTags;
}

function resolveNode(node: TagTreeNodeUnion, lut: ResolvedTagPaths, parents: TagTreeNodeUnion[]) {
  const localParents = parents.concat(node);
  if ('children' in node) {
    for (const child of node.children) {
      resolveNode(child, lut, localParents);
    }
  } else if ('tagName' in node) {
    lut[node.tagName] = localParents;
  }
}

export function getTagCatalogOnce<ARGS>(
  originalGetTagCatalog: (args: ARGS) => Observable<Result<TagCatalog>>,
  withFullTimePrecision: boolean = false,
  source?: string
): (args: ARGS) => Observable<Result<TagCatalog>> {
  return memoize<ARGS, Result<TagCatalog>>(
    (args: ARGS) =>
      originalGetTagCatalog(args).map(result => {
        if (result.data) {
          return success(enrichTagCatalog(result.data, source));
        }
        return result;
      }),
    withFullTimePrecision ? generateStableHash : generateGetTagCatalogRequestId,
    Number.MAX_VALUE
  );
}

function generateGetTagCatalogRequestId(args: any = {}) {
  let week;
  const timeConfig: TimeConfig | undefined = args.timeConfig;
  if (timeConfig) {
    const from = (timeConfig.to ?? Date.now()) - timeConfig.windowSize;
    week = roundDownToWeek(from);
  }
  return generateStableHash({
    ...args,
    timeConfig: null,
    week
  });
}
