import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import SelectorOverlay from 'in-new-components/SelectorOverlay/SelectorOverlay';
import { emptyArray } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TagSelectorOverlay.mless';

export default function TagSelectorOverlay({ tagCatalog, onChange, close }) {
  const options = useMemo(() => toOptions(tagCatalog, tagCatalog.tagTree), [tagCatalog]);

  return (
    <SelectorOverlay
      withIcons
      options={options.slice(1)}
      nonSearchableOptions={options.slice(0, 1)} // commonly used tags are the first category and should not be searchable
      onChange={node => {
        onChange({ name: node.tagName });
        close();
      }}
    />
  );
}

function toOptions(tagCatalog, tagTreeNodes, parentLabels = []) {
  const joinedParentLabels = parentLabels.join(' ');
  return tagTreeNodes.map(tagTreeNode => {
    return {
      label: tagTreeNode.label,
      breadcrumbAndLabel: (
        <BreadcrumbAndLabel
          path={parentLabels}
          label={tagTreeNode.label}
          hasChildren={tagTreeNode.children?.length > 0}
        />
      ),
      description: tagTreeNode.description,
      keywords: [joinedParentLabels, tagTreeNode.label, tagTreeNode.description, tagTreeNode.tagName]
        .filter(Boolean)
        .join(' '),
      tagName: tagTreeNode.tagName,
      icon: tagTreeNode.icon,
      children: tagTreeNode.children
        ? toOptions(tagCatalog, tagTreeNode.children, parentLabels.concat(tagTreeNode.label))
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

TagSelectorOverlay.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
