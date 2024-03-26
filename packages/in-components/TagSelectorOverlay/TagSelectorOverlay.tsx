/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';
import { get } from 'lodash';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

//@ts-expect-error TS migration needed
import * as typeToLabelMapping from 'in-components/QueryBuilder/tagFilter/typeToLabelMapping';
//@ts-expect-error TS migration needed
import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { Nullish, TagTreeNodeUnion, TagType } from 'in-types';
import { emptyArray } from 'in-services/fixedObjects';
import { settings$ } from 'in-services/settings';
import Pill from 'in-components/Pill';

import locals from './TagSelectorOverlay.mless';

interface TagSelectorOverlayProps {
  tagCatalog: EnrichedTagCatalog;
  onChange: ({ name, tagType }: { name: string; tagType?: TagType }) => void;
  close: VoidFunction;
  showTypeBadge?: boolean;
}

interface NodeProps {
  tagName: string;
  tagType?: TagType;
}

export default function TagSelectorOverlay({ tagCatalog, onChange, close, showTypeBadge }: TagSelectorOverlayProps) {
  const queryableOnly = useObservable(
    settings$.map(settings => get(settings, ['use_queryable_tags_enabled'], true)),
    []
  );
  const options = useMemo(
    () => toOptions(tagCatalog, tagCatalog.tagTree, showTypeBadge, queryableOnly, []),
    [showTypeBadge, tagCatalog, queryableOnly]
  );

  useDisabledBodyScroll();
  const [query, onQueryChange] = useState('');

  return (
    <SelectorOverlay
      withIcons
      options={options}
      onChange={(node: NodeProps) => {
        onChange({ name: node.tagName, tagType: node.tagType });
        close();
      }}
      query={query}
      onQueryChange={onQueryChange}
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
  children: Options[];
  withHighlights?: {
    label: string | JSX.Element;
    description?: string | JSX.Element;
  };
  tagType?: TagType;
}

function toOptions(
  tagCatalog: EnrichedTagCatalog,
  tagTreeNodes: TagTreeNodeUnion[],
  showTypeBadge: boolean | Nullish,
  queryableOnly: boolean,
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
              parentLabels.concat(tagTreeNode.label)
            )
          : (emptyArray as unknown as Options[]);
      // filter empty category nodes
      return tagTreeNode.type === 'LEVEL' && filteredChildren?.length === 0
        ? null
        : {
            label: tagTreeNode.label,
            badge:
              showTypeBadge &&
              'tagName' in tagTreeNode &&
              Boolean(tagTreeNode.tagName) &&
              ((<Badge tagTreeNode={tagTreeNode} tagCatalog={tagCatalog} />) as JSX.Element | Nullish),
            parentLabels: parentLabels,
            description: tagTreeNode.description,
            keywords: [joinedParentLabels, tagTreeNode.label].filter(Boolean).join(' '),
            tagName: 'tagName' in tagTreeNode ? tagTreeNode.tagName : '',
            icon: tagTreeNode.icon,
            children: filteredChildren,
            tagType: 'tagName' in tagTreeNode ? tagCatalog.tagsByName?.[tagTreeNode.tagName]?.type : undefined
          };
    })
    .filter(Boolean) as Options[];
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
  tagCatalog: EnrichedTagCatalog;
}

function Badge({ tagTreeNode, tagCatalog }: BadgeProps): JSX.Element | null {
  // only show for leaves
  if ('children' in tagTreeNode && tagTreeNode.children?.length > 0) return null;

  const tag = 'tagName' in tagTreeNode ? tagCatalog.tagsByName[tagTreeNode.tagName] : undefined;
  const type = typeToLabelMapping[tag?.type];
  return type && <Pill color={themes.default.ids.color.option.neutral['600']}>{type}</Pill>;
}
