/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { ListGroup } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  badgeColumnDefinition,
  breadcrumbAndLabelColumnDefinition,
  iconColumnDefinition,
  Item,
  labelColumnDefinition,
  rightArrowColumnDefinition
} from 'in-new-components/SelectorOverlay/Node';
import NodeWithDynoChildren from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/NodeWithDynoChildren';
import IndeterminateLoadingIndicator from 'in-new-components/LoadingIndicators/IndeterminateLoadingIndicator';
import { LoadingIndicator } from 'in-new-components/LoadingIndicators';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';

const loadingColumnDefinition = {
  width: '2rem',
  getContent() {
    return <IndeterminateLoadingIndicator size={32} />;
  }
};

export function DynamicNode(props) {
  if (props.node?.loadChildren) {
    return <FetchingChildrenNode {...props} />;
  }
  return <NodeWithDynoChildren {...props} />;
}

function FetchingChildrenNode({ node, focusNode, onChange, withIcons, withBreadcrumbs, asListGroup, height }) {
  const { loadChildren, label } = node;

  const result = useObservable(loadChildren && loadChildren, [loadChildren]) ?? pendingResult;

  const loading = isLoading(result);
  const resolvedChildren = result?.data?.items;

  if (!loading && resolvedChildren) {
    node.children = resolvedChildren;
    node.loadChildren = undefined;
  }

  if (resolvedChildren?.length === 0 || loading) {
    // empty
    let columnDefinitions = [withBreadcrumbs ? breadcrumbAndLabelColumnDefinition : labelColumnDefinition];
    columnDefinitions.push(badgeColumnDefinition);
    if (withIcons) {
      columnDefinitions.unshift(iconColumnDefinition);
    }
    if (loading) {
      columnDefinitions.push(loadingColumnDefinition);
    }
    return (
      <Item node={node} onClick={loading ? undefined : () => onChange(node)} columnDefinitions={columnDefinitions} />
    );
  }

  if (asListGroup) {
    return (
      <ListGroup label={label} height={height} sticky>
        {loading && <LoadingIndicator />}
        {!loading &&
          resolvedChildren?.map((node, i) => (
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

  let columnDefinitions = [labelColumnDefinition, badgeColumnDefinition];
  if (loading) {
    columnDefinitions.push(loadingColumnDefinition);
  } else {
    columnDefinitions.push(rightArrowColumnDefinition);
  }
  if (withIcons) {
    columnDefinitions.unshift(iconColumnDefinition);
  }
  return (
    <Item node={node} onClick={loading ? undefined : () => focusNode(node)} columnDefinitions={columnDefinitions} />
  );
}
