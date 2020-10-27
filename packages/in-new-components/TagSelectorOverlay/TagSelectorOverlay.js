import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import theme from 'in-themes';

import * as typeToLabelMapping from 'in-new-components/QueryBuilder/tagFilter/typeToLabelMapping';
import SelectorOverlay from 'in-new-components/SelectorOverlay/SelectorOverlay';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { emptyArray } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';

import locals from './TagSelectorOverlay.mless';

export default function TagSelectorOverlay({ tagCatalog, onChange, close, showTypeBadge }) {
  const options = useMemo(() => toOptions(tagCatalog, tagCatalog.tagTree, [], showTypeBadge), [tagCatalog]);

  useDisabledBodyScroll();

  return (
    <SelectorOverlay
      withIcons
      options={options}
      onChange={node => {
        onChange({ name: node.tagName });
        close();
      }}
    />
  );
}

function toOptions(tagCatalog, tagTreeNodes, parentLabels = [], showTypeBadge) {
  const joinedParentLabels = parentLabels.join(' ');
  return tagTreeNodes.map(tagTreeNode => {
    return {
      label: tagTreeNode.label,
      badge: showTypeBadge && tagTreeNode.tagName && <Badge tagTreeNode={tagTreeNode} tagCatalog={tagCatalog} />,
      breadcrumbAndLabel: (
        <BreadcrumbAndLabel
          path={parentLabels}
          label={tagTreeNode.label}
          hasChildren={tagTreeNode.children?.length > 0}
        />
      ),
      searchable: tagTreeNode.searchable,
      description: tagTreeNode.description,
      keywords: [joinedParentLabels, tagTreeNode.label, tagTreeNode.description, tagTreeNode.tagName]
        .filter(Boolean)
        .join(' '),
      tagName: tagTreeNode.tagName,
      icon: tagTreeNode.icon,
      children: tagTreeNode.children
        ? toOptions(tagCatalog, tagTreeNode.children, parentLabels.concat(tagTreeNode.label), showTypeBadge)
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

function Badge({ tagTreeNode, tagCatalog }) {
  // only show for leaves
  if (tagTreeNode.children?.length > 0) return null;

  const tag = tagCatalog.tagsByName[tagTreeNode.tagName];
  const type = typeToLabelMapping[tag?.type];
  return type && <Pill color={theme.lib.colors.N600Light}>{type}</Pill>;
}

TagSelectorOverlay.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  showTypeBadge: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
