/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import { get } from 'lodash';

import { SvgIcon, Pill } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

//@ts-expect-error TS migration needed
import * as typeToLabelMapping from 'in-components/QueryBuilder/tagFilter/typeToLabelMapping';
import { EnrichedTagCatalog, TagWithPath, mergeTagCatalogs } from 'in-services/tags/tagCatalog';
import { MinimalTagDefinition } from 'in-components/QueryBuilder/transformation/formModel';
import { minimizeTagDefinition } from 'in-components/QueryBuilder/validation/tagForm';
import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';
import { emptyArray, noop, pendingResult } from 'in-services/fixedObjects';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { TagOptions } from 'in-components/SelectorOverlay/Node';
import { GetTagCatalog } from 'in-components/QueryBuilder';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { TagTreeNodeUnion, TagType } from 'in-types';
import { isNotBlank } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { settings$ } from 'in-services/settings';

import locals from './TagSelectorOverlay.mless';

interface TagSelectorOverlayProps<ADDITIONAL_TAG_CATALOG_PROPS = {}> {
  tagCatalog: EnrichedTagCatalog;
  getTagCatalog?: GetTagCatalog;
  additionalGetTagCatalogProps?: ADDITIONAL_TAG_CATALOG_PROPS;
  onChange: (props: OnChangeProps) => void;
  close: VoidFunction;
  showTypeBadge?: boolean;
  addTagDefinitionToFormModel?: boolean;
}

interface OnChangeProps {
  name: string;
  tagType: TagType;
  tagDefinition?: MinimalTagDefinition;
}

export default function TagSelectorOverlay({
  tagCatalog: staticTagCatalog,
  onChange,
  close,
  showTypeBadge = false,
  getTagCatalog,
  additionalGetTagCatalogProps,
  addTagDefinitionToFormModel
}: Readonly<TagSelectorOverlayProps>) {
  const queryableOnly = useObservable(
    settings$.map(settings => get(settings, ['use_queryable_tags_enabled'], true)),
    []
  );
  const query = useDebouncedValue('', noop, 800);
  const timeConfig = useTimeConfig();
  const shouldUseQueryCatalog = isNotBlank(query.value) && getTagCatalog;
  const queryCatalog =
    useObservable(
      () =>
        shouldUseQueryCatalog
          ? getTagCatalog({ timeConfig, query: query.debouncedValue, ...additionalGetTagCatalogProps })
          : just(success(undefined)),
      [shouldUseQueryCatalog, timeConfig, query.debouncedValue, getTagCatalog, additionalGetTagCatalogProps]
    ) ?? pendingResult;
  const tagCatalog =
    shouldUseQueryCatalog && queryCatalog?.data
      ? mergeTagCatalogs(queryCatalog.data, staticTagCatalog)
      : staticTagCatalog;
  const options = useMemo(
    () => toOptions(tagCatalog, tagCatalog.tagTree, showTypeBadge, queryableOnly, undefined, []),
    [showTypeBadge, tagCatalog, queryableOnly]
  );

  useDisabledBodyScroll();

  return (
    <SelectorOverlay
      withIcons
      options={options}
      onChange={node => {
        if (node.type === 'TAG') {
          onChange({
            name: node.tagName,
            tagType: node.tagType || 'STRING',
            tagDefinition: addTagDefinitionToFormModel ? minimizeTagDefinition(node.tagDefinition) : undefined
          });
        }
        close();
      }}
      query={query.value}
      onQueryChange={query.onChange}
      loading={shouldUseQueryCatalog ? query.debouncedValue !== query.value || queryCatalog.progress?.loading : false}
      showLoadingInBackground
    />
  );
}

function toOptions(
  tagCatalog: EnrichedTagCatalog | undefined,
  tagTreeNodes: TagTreeNodeUnion[],
  showTypeBadge: boolean,
  queryableOnly: boolean,
  scoreBoost?: number,
  parentLabels: string[] = []
): TagOptions[] {
  return tagTreeNodes
    .filter(tagTreeNode => {
      return (
        (!queryableOnly || tagTreeNode.type === 'LEVEL' || tagTreeNode.queryable !== false) &&
        ('hidden' in tagTreeNode && tagTreeNode.hidden) !== true
      );
    })
    .map((tagTreeNode: TagTreeNodeUnion): TagOptions | null => {
      const filteredChildren =
        'children' in tagTreeNode
          ? toOptions(
              tagCatalog,
              tagTreeNode.children,
              showTypeBadge,
              queryableOnly,
              tagTreeNode.scoreBoost,
              parentLabels.concat(tagTreeNode.label)
            )
          : (emptyArray as unknown as TagOptions[]);
      // filter empty category nodes
      if (tagTreeNode.type === 'LEVEL' && filteredChildren?.length === 0) {
        return null;
      }
      const tagDefinition = 'tagName' in tagTreeNode ? tagCatalog?.tagsByName?.[tagTreeNode.tagName] : undefined;
      return {
        type: 'TAG',
        label: tagTreeNode.label,
        badge:
          showTypeBadge && 'tagName' in tagTreeNode && Boolean(tagTreeNode.tagName) ? (
            <Badge tagTreeNode={tagTreeNode} tagDefinition={tagDefinition} />
          ) : undefined,
        parentLabels: parentLabels,
        description: tagTreeNode.description,
        tagName: 'tagName' in tagTreeNode ? tagTreeNode.tagName : '',
        icon: tagTreeNode.icon,
        scoreBoost: multiplyBoost(scoreBoost, tagTreeNode.scoreBoost),
        children: filteredChildren,
        tagType: tagDefinition?.type || 'STRING',
        tagDefinition: tagDefinition,
        disabled: false
      };
    })
    .filter(Boolean) as TagOptions[];
}

function multiplyBoost(scoreA?: number, scoreB?: number) {
  if (!scoreA) {
    return scoreB;
  }
  if (!scoreB) {
    return scoreA;
  }
  return scoreA * scoreB;
}

interface BreadcrumbAndLabelProps {
  path: string[];
  pathLabels?: (JSX.Element | string)[];
  label: JSX.Element | string;
  hasChildren: boolean;
}

export function BreadcrumbAndLabel({
  path,
  label,
  hasChildren,
  pathLabels = []
}: Readonly<BreadcrumbAndLabelProps>): JSX.Element {
  if (hasChildren) {
    return <>{label}</>;
  }

  return (
    <>
      {path.map((part, i) => (
        <span className={locals.path} key={`${part}-${i}`}>
          {pathLabels[i] || part}
          <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
        </span>
      ))}
      {label}
    </>
  );
}

interface BadgeProps {
  tagTreeNode: TagTreeNodeUnion;
  tagDefinition?: TagWithPath;
}

function Badge({ tagTreeNode, tagDefinition }: BadgeProps): JSX.Element | null {
  // only show for leaves
  if ('children' in tagTreeNode && tagTreeNode.children?.length > 0) return null;

  const type = typeToLabelMapping[tagDefinition?.type];
  return type && <Pill color={themes.default.ids.color.option.neutral['600']}>{type}</Pill>;
}
