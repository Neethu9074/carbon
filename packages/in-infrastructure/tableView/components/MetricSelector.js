/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getCategories } from 'in-sdk/metrics';
import { t } from 'in-i18n';

import './MetricSelector.less';

const block = 'in-metric-selector';

export default function MetricSelector({ id, className, plugin, label, onChange, value, selectedMetrics }) {
  const categoryTree = getCategories(plugin);
  if (categoryTree.length === 0) {
    return null;
  }

  let classes = block;
  if (className) {
    classes += ` ${className}`;
  }

  const select = (
    <select id={id} className={`${block}__selection`} value={value} onChange={onChange}>
      <option value="-1">{t('in-infrastructure:tableView.pleaseSelect')}</option>

      {categoryTree.map((categoryNode, i) => (
        <MetricNode key={i} categoryNode={categoryNode} selectedMetrics={selectedMetrics} />
      ))}
    </select>
  );

  if (label) {
    return (
      <label htmlFor="metric-selector" className={classes}>
        {label ? <span className={`${block}__label`}>{label}</span> : null}

        {select}
      </label>
    );
  }

  return select;
}

function MetricNode({ categoryNode, selectedMetrics }) {
  if (categoryNode.type === 'metric') {
    return <option value={categoryNode.metric}>{categoryNode.label}</option>;
  }

  const children = categoryNode.children.filter(
    child => child.type !== 'metric' || selectedMetrics.indexOf(child.metric) === -1
  );

  if (children.length === 0) {
    return null;
  }

  return (
    <optgroup label={categoryNode.label}>
      {children.map((subCategoryNode, i) => (
        <MetricNode key={i} categoryNode={subCategoryNode} selectedMetrics={selectedMetrics} />
      ))}
    </optgroup>
  );
}
