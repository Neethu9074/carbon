/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ColumnizedContent, ColumnizedDefinition, KeyValue, Li, ListGroup, SvgIcon } from '@instana/components';

import { BreadcrumbAndLabel } from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { TagWithPath } from 'in-services/tags/tagCatalog';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { TagType } from 'in-types';

import locals from './Node.mless';

export interface Options {
  label: string;
  badge?: JSX.Element;
  parentLabels: string[];
  description?: string;
  tagName: string;
  icon?: string;
  scoreBoost?: number;
  children?: Options[];
  tagType: TagType;
  levelType?: string;
  tagDefinition?: TagWithPath;
  disabled?: boolean;
}

export interface OptionsResult extends Options {
  withHighlights: Highlights;
  score: number;
}

export interface Highlights {
  label: string | JSX.Element;
  description?: string | JSX.Element;
  parentLabels: (string | JSX.Element)[];
}

interface Column {
  node: OptionsResult;
}

export const iconColumnDefinition = {
  width: '2rem',
  getContent({ node }: Column) {
    return (
      <Tooltip delay={2000} content={node.tagName}>
        <SvgIcon className={locals.icon} type={node.icon ?? 'lib_views_tag'} />
      </Tooltip>
    );
  }
};

export const labelColumnDefinition: ColumnizedDefinition = {
  getContent({ node }: Column) {
    return (
      <KeyValue
        inverted
        accentuated
        value={node.label}
        label={node.description}
        className={locals.keyValue}
        multilineValue
        multilineLabel
      />
    );
  }
};

export const breadcrumbAndLabelColumnDefinition: ColumnizedDefinition = {
  getContent({ node }: Column) {
    return (
      <KeyValue
        inverted
        accentuated
        value={
          <BreadcrumbAndLabel
            path={node.parentLabels}
            pathLabels={node.withHighlights.parentLabels}
            label={node.withHighlights.label}
            hasChildren={'children' in node && !!node.children && node.children.length > 0}
          />
        }
        label={node.withHighlights.description}
        className={locals.keyValue}
        multilineValue
        multilineLabel
      />
    );
  }
};

export const badgeColumnDefinition: ColumnizedDefinition = {
  width: 'max-content',
  getContent({ node }: Column) {
    return node.badge;
  }
};

export const rightArrowColumnDefinition = {
  width: '2rem',
  getContent() {
    return <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />;
  }
};

export interface SelectorNodeProps {
  node: Options;
  focusNode: (node: Options) => void;
  onChange: (node: Options) => void;
  withIcons: boolean;
  withBreadcrumbs?: boolean;
  asListGroup: boolean;
  height?: string; //css type height
}

export default function SelectorNode({
  node,
  focusNode,
  onChange,
  withIcons,
  withBreadcrumbs,
  asListGroup,
  height
}: SelectorNodeProps) {
  if (!node.children || node.children.length === 0) {
    let columnDefinitions = [withBreadcrumbs ? breadcrumbAndLabelColumnDefinition : labelColumnDefinition];
    columnDefinitions.push(badgeColumnDefinition);
    if (withIcons) {
      columnDefinitions.unshift(iconColumnDefinition);
    }
    return <Item node={node} onClick={() => onChange(node)} columnDefinitions={columnDefinitions} />;
  } else if (asListGroup) {
    return (
      <ListGroup label={node.label} height={height} sticky>
        {node.children.map((node, i) => (
          <SelectorNode
            key={i}
            node={node}
            focusNode={focusNode}
            onChange={onChange}
            withIcons={withIcons}
            asListGroup={false}
          />
        ))}
      </ListGroup>
    );
  } else {
    let columnDefinitions = [labelColumnDefinition, badgeColumnDefinition, rightArrowColumnDefinition];
    if (withIcons) {
      columnDefinitions.unshift(iconColumnDefinition);
    }
    return <Item node={node} onClick={() => focusNode(node)} columnDefinitions={columnDefinitions} />;
  }
}

export interface ItemProps {
  node: Options;
  onClick: (() => void) | undefined;
  columnDefinitions: ColumnizedDefinition[];
}

export function Item({ node, onClick, columnDefinitions }: ItemProps) {
  return (
    <Li
      noAlternatingBg
      onClick={node.disabled ? undefined : onClick}
      className={classNames({
        [locals.option]: true,
        [locals.disabled]: node.disabled
      })}
    >
      <ColumnizedContent columnDefinitions={columnDefinitions} node={node} />
    </Li>
  );
}
