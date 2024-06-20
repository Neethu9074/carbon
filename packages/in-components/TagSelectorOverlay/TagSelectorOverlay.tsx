/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import { get } from 'lodash';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { just } from '@instana/observables';
import { Pill } from '@instana/components';

//@ts-expect-error TS migration needed
import * as typeToLabelMapping from 'in-components/QueryBuilder/tagFilter/typeToLabelMapping';
//@ts-expect-error TS migration needed
import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';
import { EnrichedTagCatalog, TagWithPath, mergeTagCatalogs } from 'in-services/tags/tagCatalog';
import { MinimalTagDefinition } from 'in-components/QueryBuilder/transformation/formModel';
import { minimizeTagDefinition } from 'in-components/QueryBuilder/validation/tagForm';
import { emptyArray, noop, pendingResult } from 'in-services/fixedObjects';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { Nullish, TagTreeNodeUnion, TagType } from 'in-types';
import { GetTagCatalog } from 'in-components/QueryBuilder';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
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
}

interface OnChangeProps {
  name: string;
  tagType?: TagType;
  tagDefinition?: MinimalTagDefinition;
}

interface NodeProps {
  tagName: string;
  tagType?: TagType;
  tagDefinition?: TagWithPath;
}

export default function TagSelectorOverlay({
  tagCatalog: staticTagCatalog,
  onChange,
  close,
  showTypeBadge,
  getTagCatalog,
  additionalGetTagCatalogProps
}: TagSelectorOverlayProps) {
  const queryableOnly = useObservable(
    settings$.map(settings => get(settings, ['use_queryable_tags_enabled'], true)),
    []
  );
  const query = useDebouncedValue('', noop, 800);
  const timeConfig = useTimeConfig();
  const shouldUseQueryCatalog = isNotBlank(query.value) && getTagCatalog && additionalGetTagCatalogProps;
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
      onChange={(node: NodeProps) => {
        onChange({
          name: node.tagName,
          tagType: node.tagType,
          tagDefinition:
            getTagCatalog && additionalGetTagCatalogProps ? minimizeTagDefinition(node.tagDefinition) : undefined
        });
        close();
      }}
      query={query.value}
      onQueryChange={query.onChange}
      loading={shouldUseQueryCatalog ? query.debouncedValue !== query.value || queryCatalog.progress?.loading : false}
      showLoadingInBackground
    />
  );
}

export interface Options {
  label: string;
  badge: JSX.Element | Nullish | false;
  parentLabels: string[];
  description?: string;
  keywords: string;
  tagName: string;
  icon?: string;
  scoreBoost?: number;
  children: Options[];
  withHighlights?: {
    label: string | JSX.Element;
    description?: string | JSX.Element;
    parentLabels: (string | JSX.Element)[];
  };
  tagType?: TagType;
  levelType?: string;
  tagDefinition?: TagWithPath;
}

function toOptions(
  tagCatalog: EnrichedTagCatalog | undefined,
  tagTreeNodes: TagTreeNodeUnion[],
  showTypeBadge: boolean | Nullish,
  queryableOnly: boolean,
  scoreBoost?: number,
  parentLabels: string[] = []
): Options[] {
  const joinedParentLabels = parentLabels.join(' ');
  return tagTreeNodes
    .filter(tagTreeNode => {
      return (
        (!queryableOnly || tagTreeNode.type === 'LEVEL' || tagTreeNode.queryable !== false) &&
        ('hidden' in tagTreeNode && tagTreeNode.hidden) !== true
      );
    })
    .map((tagTreeNode: TagTreeNodeUnion): Options | null => {
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
          : (emptyArray as unknown as Options[]);
      // filter empty category nodes
      if (tagTreeNode.type === 'LEVEL' && filteredChildren?.length === 0) {
        return null;
      }
      const tagDefinition = 'tagName' in tagTreeNode ? tagCatalog?.tagsByName?.[tagTreeNode.tagName] : undefined;
      return {
        label: tagTreeNode.label,
        badge:
          showTypeBadge &&
          'tagName' in tagTreeNode &&
          Boolean(tagTreeNode.tagName) &&
          ((<Badge tagTreeNode={tagTreeNode} tagDefinition={tagDefinition} />) as JSX.Element | Nullish),
        parentLabels: parentLabels,
        description: tagTreeNode.description,
        keywords: [joinedParentLabels, tagTreeNode.label].filter(Boolean).join(' '),
        tagName: 'tagName' in tagTreeNode ? tagTreeNode.tagName : '',
        icon: tagTreeNode.icon,
        scoreBoost: multiplyBoost(scoreBoost, tagTreeNode.scoreBoost),
        children: filteredChildren,
        tagType: tagDefinition?.type,
        tagDefinition: tagDefinition
      };
    })
    .filter(Boolean) as Options[];
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
  label: string;
  hasChildren: boolean;
}

export function BreadcrumbAndLabel({ path, label, hasChildren }: BreadcrumbAndLabelProps): JSX.Element {
  if (hasChildren) {
    return <>{label}</>;
  }

  return (
    <>
      {path.map((part, i) => (
        <span className={locals.path} key={`${part}-${i}`}>
          {part}
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
