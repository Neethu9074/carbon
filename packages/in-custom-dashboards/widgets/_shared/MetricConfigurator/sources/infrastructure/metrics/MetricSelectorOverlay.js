/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import BreadcrumbAndLabel from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/BreadcrumbAndLabel';
import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { emptyArray } from 'in-services/fixedObjects';

export default function MetricSelectorOverlay({
  metricCatalog,
  loading,
  onChange,
  close,
  query,
  onQueryChange,
  disabled
}) {
  const options = useMemo(
    () => (metricCatalog && metricCatalog.tree ? toOptions(metricCatalog.tree, []) : emptyArray),
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
        onChange(node);
        close();
      }}
      query={query}
      onQueryChange={onQueryChange}
      disabled={disabled}
      strict
    />
  );
}

export function toOptions(metricTreeNodes, parentLabels = []) {
  const joinedParentLabels = parentLabels.join(' ');
  return metricTreeNodes.map(metricTreeNode => {
    return {
      label: metricTreeNode.label,
      breadcrumbAndLabel: (
        <BreadcrumbAndLabel
          path={parentLabels}
          label={metricTreeNode.label}
          hasChildren={metricTreeNode.children?.length > 0}
        />
      ),
      parentLabels,
      description: metricTreeNode.description,
      metric: metricTreeNode.name,
      type: metricTreeNode.type,
      parentType: metricTreeNode.parentType ?? metricTreeNode.type, // parentType was previously sent as type before R221
      icon: metricTreeNode.icon,
      allowedCrossSeriesAggregations: metricTreeNode.allowedCrossSeriesAggregations ?? [],
      keywords: [
        joinedParentLabels,
        metricTreeNode.label,
        metricTreeNode.description,
        metricTreeNode.name,
        metricTreeNode.parentType
      ]
        .filter(Boolean)
        .join(' '),
      children: metricTreeNode.children
        ? toOptions(metricTreeNode.children, parentLabels.concat(metricTreeNode.label))
        : emptyArray
    };
  });
}


MetricSelectorOverlay.propTypes = {
  metricCatalog: PropTypes.any,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
