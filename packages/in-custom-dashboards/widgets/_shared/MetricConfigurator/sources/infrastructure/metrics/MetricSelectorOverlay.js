/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import SelectorOverlay from 'in-new-components/SelectorOverlay/SelectorOverlay';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { emptyArray } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MetricSelectorOverlay.mless';

export default function MetricSelectorOverlay({ metricCatalog, loading, onChange, close, query, onQueryChange }) {
  const options = useMemo(() => (loading ? emptyArray : toOptions(metricCatalog.tree, [])), [metricCatalog, loading]);

  useDisabledBodyScroll();

  return (
    <SelectorOverlay
      withIcons
      options={options}
      loading={loading}
      onChange={node => {
        onChange({ metric: node.metric, type: node.type });
        close();
      }}
      query={query}
      onQueryChange={onQueryChange}
    />
  );
}

function toOptions(metricTreeNodes, parentLabels = []) {
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
      description: metricTreeNode.description,
      metric: metricTreeNode.name,
      type: metricTreeNode.type,
      icon: metricTreeNode.icon,
      keywords: [
        joinedParentLabels,
        metricTreeNode.label,
        metricTreeNode.description,
        metricTreeNode.name,
        metricTreeNode.type
      ]
        .filter(Boolean)
        .join(' '),
      children: metricTreeNode.children
        ? toOptions(metricTreeNode.children, parentLabels.concat(metricTreeNode.label))
        : emptyArray
    };
  });
}

function BreadcrumbAndLabel({ path, label, hasChildren }) {
  if (hasChildren) {
    return <>{label}</>;
  }

  return (
    <>
      {path.map(part => (
        <span className={locals.path} key={part}>
          {part}
          <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
        </span>
      ))}
      {label}
    </>
  );
}

MetricSelectorOverlay.propTypes = {
  metricCatalog: PropTypes.any,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
