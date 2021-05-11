/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { ListGroup, ColumnizedContent } from '@instana/components';
import { KeyValue } from '@instana/components';
import { SvgIcon } from '@instana/components';
import { Li } from '@instana/components';

import { node as nodePropType } from 'in-new-components/SelectorOverlay/props';

import locals from './Node.mless';

export const iconColumnDefinition = {
  width: '2rem',
  getContent({ node }) {
    return <SvgIcon className={locals.icon} type={node.icon ?? 'lib_views_tag'} />;
  }
};

export const labelColumnDefinition = {
  getContent({ node }) {
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

export const breadcrumbAndLabelColumnDefinition = {
  getContent({ node }) {
    return (
      <KeyValue
        inverted
        accentuated
        value={node.breadcrumbAndLabel}
        label={node.description}
        className={locals.keyValue}
        multilineValue
        multilineLabel
      />
    );
  }
};

export const badgeColumnDefinition = {
  width: 'max-content',
  getContent({ node }) {
    return node.badge;
  }
};

export const rightArrowColumnDefinition = {
  width: '2rem',
  getContent() {
    return <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />;
  }
};

export default function Node({ node, focusNode, onChange, withIcons, withBreadcrumbs, asListGroup, height }) {
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
          <Node
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

export function Item({ node, onClick, columnDefinitions }) {
  return (
    <Li noAlternatingBg onClick={onClick} className={locals.option}>
      <ColumnizedContent columnDefinitions={columnDefinitions} node={node} />
    </Li>
  );
}

Node.propTypes = {
  node: nodePropType.isRequired,
  focusNode: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  withIcons: PropTypes.bool.isRequired,
  asListGroup: PropTypes.bool.isRequired
};
