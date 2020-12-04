import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import SelectorOverlay from 'in-new-components/SelectorOverlay/SelectorOverlay';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { emptyArray } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MetricSelectorOverlay.mless';

export default function MetricSelectorOverlay({ metricCatalog, onChange, close }) {
  //TODO need to change structure to rename tagTree into tree
  const options = useMemo(() => toOptions(metricCatalog.tagTree, []), [metricCatalog]);

  useDisabledBodyScroll();

  return (
    <SelectorOverlay
      withIcons
      options={options}
      onChange={node => {
        onChange({ name: node.metricName });
        close();
      }}
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
      searchable: metricTreeNode.searchable,
      description: metricTreeNode.description,
      keywords: [joinedParentLabels, metricTreeNode.label, metricTreeNode.description, metricTreeNode.tagName]
        .filter(Boolean)
        .join(' '),
      metricName: metricTreeNode.tagName,
      icon: metricTreeNode.icon,
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
  metricCatalog: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
