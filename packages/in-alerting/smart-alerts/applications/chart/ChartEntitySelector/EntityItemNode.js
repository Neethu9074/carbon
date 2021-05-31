/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { KeyValue } from '@instana/components';

import {
  badgeColumnDefinition,
  iconColumnDefinition,
  Item,
  labelColumnDefinition,
  rightArrowColumnDefinition
} from 'in-new-components/SelectorOverlay/Node';
import { node as nodePropType } from 'in-new-components/SelectorOverlay/props';

import locals from './ScopeSelectorItem.mless';

export default function EntityItemNode({ node, focusNode, onChange, withIcons, asSearchResult }) {
  const noChildren = !node.children || node.children.length === 0;

  const columnDefinitions = [asSearchResult ? searchResultColumnDefinition : labelColumnDefinition];
  columnDefinitions.push(badgeColumnDefinition);
  if (withIcons) {
    columnDefinitions.unshift(iconColumnDefinition);
  }

  if (noChildren && !node.loadChildren) {
    return <Item node={node} onClick={() => onChange(node)} columnDefinitions={columnDefinitions} />;
  }

  columnDefinitions.push(rightArrowColumnDefinition);
  return <Item node={node} onClick={() => focusNode(node)} columnDefinitions={columnDefinitions} />;
}

EntityItemNode.propTypes = {
  node: nodePropType.isRequired,
  asSearchResult: PropTypes.bool,
  focusNode: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  withIcons: PropTypes.bool.isRequired
};

const searchResultColumnDefinition = {
  getContent({ node }) {
    return <KeyValue label={node.path} className={locals.keyValue} accentuated />;
  }
};
