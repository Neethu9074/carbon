/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  badgeColumnDefinition,
  breadcrumbAndLabelColumnDefinition,
  iconColumnDefinition,
  Item,
  labelColumnDefinition,
  rightArrowColumnDefinition
} from 'in-new-components/SelectorOverlay/Node';
import { node as nodePropType } from 'in-new-components/SelectorOverlay/props';

export default function NodeWithDynoChildren({ node, focusNode, onChange, withIcons, withBreadcrumbs }) {
  const noChildren = !node.children || node.children.length === 0;

  const columnDefinitions = [withBreadcrumbs ? breadcrumbAndLabelColumnDefinition : labelColumnDefinition];
  columnDefinitions.push(badgeColumnDefinition);

  if (noChildren) {
    if (withIcons) {
      columnDefinitions.unshift(iconColumnDefinition);
    }
    return <Item node={node} onClick={() => onChange(node)} columnDefinitions={columnDefinitions} />;
  }

  columnDefinitions.push(rightArrowColumnDefinition);

  if (withIcons) {
    columnDefinitions.unshift(iconColumnDefinition);
  }
  return <Item node={node} onClick={() => focusNode(node)} columnDefinitions={columnDefinitions} />;
}

NodeWithDynoChildren.propTypes = {
  node: nodePropType.isRequired,
  withBreadcrumbs: PropTypes.bool,
  focusNode: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  withIcons: PropTypes.bool.isRequired
};
