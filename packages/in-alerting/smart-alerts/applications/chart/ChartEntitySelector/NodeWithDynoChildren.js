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
import { DynamicNode } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/DynamicNode';
import { node as nodePropType } from 'in-new-components/SelectorOverlay/props';
import { ListGroup } from 'in-new-components/lists/List/List';

export default function NodeWithDynoChildren({
  node,
  focusNode,
  onChange,
  withIcons,
  withBreadcrumbs,
  asListGroup,
  height
}) {
  const noChildren = !node.children || node.children.length === 0;
  if (noChildren) {
    let columnDefinitions = [withBreadcrumbs ? breadcrumbAndLabelColumnDefinition : labelColumnDefinition];
    columnDefinitions.push(badgeColumnDefinition);
    if (withIcons) {
      columnDefinitions.unshift(iconColumnDefinition);
    }
    return <Item node={node} onClick={() => onChange(node)} columnDefinitions={columnDefinitions} />;
  }

  if (asListGroup) {
    return (
      <ListGroup label={node.label} height={height} sticky>
        {node.children?.map((node, i) => (
          <DynamicNode
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
  }

  let columnDefinitions = [labelColumnDefinition, badgeColumnDefinition, rightArrowColumnDefinition];
  if (withIcons) {
    columnDefinitions.unshift(iconColumnDefinition);
  }
  return <Item node={node} onClick={() => focusNode(node)} columnDefinitions={columnDefinitions} />;
}

NodeWithDynoChildren.propTypes = {
  node: nodePropType.isRequired,
  withBreadcrumbs: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  focusNode: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  withIcons: PropTypes.bool.isRequired,
  asListGroup: PropTypes.bool.isRequired
};
