/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import * as typeToLabelMapping from 'in-new-components/QueryBuilder/tagFilter/typeToLabelMapping';
import SelectorOverlay from 'in-new-components/SelectorOverlay/SelectorOverlay';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import { emptyArray } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import { settings$ } from 'in-services/settings';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes';

import locals from './TagSelectorOverlay.mless';

export default function TagSelectorOverlay({ tagCatalog, onChange, close, showTypeBadge }) {
  const queryableOnly = useObservable(
    settings$.map(settings => get(settings, ['use_queryable_tags_enabled'], true)),
    []
  );
  const options = useMemo(() => toOptions(tagCatalog, tagCatalog.tagTree, [], showTypeBadge, queryableOnly), [
    showTypeBadge,
    tagCatalog,
    queryableOnly
  ]);

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

function toOptions(tagCatalog, tagTreeNodes, parentLabels = [], showTypeBadge, queryableOnly) {
  const joinedParentLabels = parentLabels.join(' ');
  return tagTreeNodes
    .filter(tagTreeNode => {
      return !queryableOnly || tagTreeNode.type === 'LEVEL' || tagTreeNode.queryable !== false;
    })
    .map(tagTreeNode => {
      const filteredChildren = tagTreeNode.children
        ? toOptions(
            tagCatalog,
            tagTreeNode.children,
            parentLabels.concat(tagTreeNode.label),
            showTypeBadge,
            queryableOnly
          )
        : emptyArray;
      // filter empty category nodes
      return tagTreeNode.type === 'LEVEL' && filteredChildren.length === 0
        ? null
        : {
            label: tagTreeNode.label,
            badge: showTypeBadge && tagTreeNode.tagName && <Badge tagTreeNode={tagTreeNode} tagCatalog={tagCatalog} />,
            breadcrumbAndLabel: (
              <BreadcrumbAndLabel
                path={parentLabels}
                label={tagTreeNode.label}
                hasChildren={tagTreeNode.children?.length > 0}
              />
            ),
            searchable: true,
            description: tagTreeNode.description,
            keywords: [joinedParentLabels, tagTreeNode.label, tagTreeNode.description, tagTreeNode.tagName]
              .filter(Boolean)
              .join(' '),
            tagName: tagTreeNode.tagName,
            icon: tagTreeNode.icon,
            children: filteredChildren
          };
    })
    .filter(Boolean);
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
