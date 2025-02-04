/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ColumnizedContent, ColumnizedDefinition, KeyValue, Li, ListGroup, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { BreadcrumbAndLabel } from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { getKey } from 'in-components/SelectorOverlay/search';
import { TagWithPath } from 'in-services/tags/tagCatalog';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { TagType } from 'in-types';

import locals from './Node.mless';

export interface AbstractOptions {
  label: string;
  badge?: JSX.Element;
  parentLabels: string[];
  description?: string;
  icon?: string;
  scoreBoost?: number;
  levelType?: string;
  disabled?: boolean;
  type: 'METRIC' | 'TAG' | 'APPLICATION' | 'SERVICE' | 'ENDPOINT';
  children?: AbstractOptions[];
}

export interface MetricOptions extends AbstractOptions {
  type: 'METRIC';
  metric?: string;
  children?: MetricOptions[];
}
export interface TagOptions extends AbstractOptions {
  type: 'TAG';
  tagName: string;
  tagType: TagType;
  tagDefinition?: TagWithPath;
  children?: TagOptions[];
}

export interface ApplicationOptions extends AbstractOptions {
  type: 'APPLICATION';
  id?: string;
}

export interface ServiceOptions extends AbstractOptions {
  type: 'SERVICE';
  id?: string;
}

export interface EndpointOptions extends AbstractOptions {
  type: 'ENDPOINT';
  id?: string;
}

export type Options = MetricOptions | TagOptions | ApplicationOptions | ServiceOptions | EndpointOptions;

export type OptionsResult<T extends Options> = {
  withHighlights: Highlights;
  score: number;
} & T;

export interface Highlights {
  label: string | JSX.Element;
  description?: string | JSX.Element;
  parentLabels: (string | JSX.Element)[];
  tag: boolean;
  metric: boolean;
}

interface Column<T extends Options> {
  node: OptionsResult<T>;
}

const defaultColor = themes.default.ids.color.option.neutral['600'];
const highlightedColor = themes.default.cds.interactive;

export const iconColumnDefinition = {
  width: '2rem',
  getContent({ node }: Column<Options>) {
    switch (node.type) {
      case 'TAG':
        return (
          <Tooltip delay={2000} content={node.tagName} legacy>
            <SvgIcon
              color={node.withHighlights?.tag ? highlightedColor : defaultColor}
              type={node.icon ?? 'lib_views_tag'}
            />
          </Tooltip>
        );
      case 'METRIC':
        return (
          <Tooltip delay={2000} content={node.metric} legacy>
            <SvgIcon
              color={node.withHighlights?.metric ? highlightedColor : defaultColor}
              type={node.icon ?? 'lib_views_metric'}
            />
          </Tooltip>
        );
      case 'APPLICATION':
        return (
          <Tooltip delay={2000} content={node.label}>
            <SvgIcon
              color={node.withHighlights?.metric ? highlightedColor : defaultColor}
              type={node.icon ?? 'lib_application'}
            />
          </Tooltip>
        );
      case 'SERVICE':
        return (
          <Tooltip delay={2000} content={node.label} legacy>
            <SvgIcon
              color={node.withHighlights?.metric ? highlightedColor : defaultColor}
              type={node.icon ?? 'lib_application_service'}
            />
          </Tooltip>
        );
      case 'ENDPOINT':
        return (
          <Tooltip delay={2000} content={node.label} legacy>
            <SvgIcon
              color={node.withHighlights?.metric ? highlightedColor : defaultColor}
              type={node.icon ?? 'lib_application_endpoint'}
            />
          </Tooltip>
        );
    }
  }
};

export const labelColumnDefinition: ColumnizedDefinition = {
  getContent({ node }: Column<Options>) {
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
  getContent({ node }: Column<Options>) {
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
  getContent({ node }: Column<Options>) {
    return node.badge;
  }
};

export const rightArrowColumnDefinition = {
  width: '2rem',
  getContent() {
    return <SvgIcon color={defaultColor} type="lib_arrow_expand_right" />;
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
}: Readonly<SelectorNodeProps>) {
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
        {node.children.map(node => (
          <SelectorNode
            key={getKey(node as Options)}
            node={node as Options}
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
  node: AbstractOptions;
  onClick: (() => void) | undefined;
  columnDefinitions: ColumnizedDefinition[];
}

export function Item({ node, onClick, columnDefinitions }: Readonly<ItemProps>) {
  return (
    <Li
      data-testid={`nodeItem-${node.label}`}
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
