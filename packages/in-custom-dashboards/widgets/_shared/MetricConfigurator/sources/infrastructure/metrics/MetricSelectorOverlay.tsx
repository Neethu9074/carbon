/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { MetricOptions } from 'in-components/SelectorOverlay/Node';
import { MetricCatalog, MetricTreeNodeUnion } from 'in-types';

interface MetricSelectorOverlayProps {
  metricCatalog: MetricCatalog;
  loading: boolean;
  onChange: (node: MetricOptions) => void;
  close?: VoidFunction;
  query: string;
  onQueryChange: (query: string) => void;
  onSelectType: (t?: string) => void;
  disabled: boolean;
  backButton: boolean;
}

export default function MetricSelectorOverlay({
  metricCatalog,
  loading,
  onChange,
  close,
  query,
  onQueryChange,
  onSelectType,
  disabled,
  backButton
}: Readonly<MetricSelectorOverlayProps>) {
  const options = useMemo(
    () => (metricCatalog?.tree ? toOptions(metricCatalog.tree, []) : ([] as MetricOptions[])),
    [metricCatalog]
  );

  useDisabledBodyScroll();

  return (
    <SelectorOverlay
      withIcons
      options={options}
      loading={loading}
      shouldTriggerWindowResize
      onChange={node => {
        if (node.type === 'METRIC') {
          onChange(node);
        }
        onSelectType?.(undefined);
        close?.();
      }}
      query={query}
      onQueryChange={onQueryChange}
      // when filtering on a type, the metric catalog will already be filtered on that type, so options will contain all metrics from that type
      onFocusNode={focusedNode => onSelectType?.(focusedNode?.levelType)}
      disabled={disabled}
      nodesToSearchFrom={(options, focusedNode) => (focusedNode?.levelType ? [focusedNode] : options)}
      backButton={backButton}
    />
  );
}

export function toOptions(metricTreeNodes: MetricTreeNodeUnion[], parentLabels: string[] = []): MetricOptions[] {
  return metricTreeNodes.map((metricTreeNode: MetricTreeNodeUnion) => {
    const common = {
      label: metricTreeNode.label,
      parentLabels,
      description: metricTreeNode.description
    };
    if (metricTreeNode.type == 'LEVEL') {
      return {
        type: 'METRIC',
        ...common,
        levelType: metricTreeNode.levelType,
        icon: (metricTreeNode.levelType && getIconType(metricTreeNode.levelType)) || metricTreeNode.icon,
        children: metricTreeNode.children
          ? toOptions(metricTreeNode.children, parentLabels.concat(metricTreeNode.label))
          : ([] as MetricOptions[])
      };
    } else {
      return {
        type: 'METRIC',
        ...common,
        metric: metricTreeNode.name,
        icon: metricTreeNode.icon,
        allowedCrossSeriesAggregations: metricTreeNode.allowedCrossSeriesAggregations ?? [],
        levelType: metricTreeNode.parentType
      };
    }
  });
}
