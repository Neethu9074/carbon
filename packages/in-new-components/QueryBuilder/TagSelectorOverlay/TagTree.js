import PropTypes from 'prop-types';
import React from 'react';

import filterCatalog from 'in-new-components/QueryBuilder/TagSelectorOverlay/tagCatalogFilter';
import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { ColumnizedContent } from 'in-new-components/lists/List';
import { ListGroup } from 'in-new-components/lists/List/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TagTree.mless';

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ child }) {
      return <SvgIcon className={locals.icon} type={child.icon ?? 'lib_views_tag'} />;
    }
  },
  {
    getContent({ child }) {
      return child.label;
    }
  },
  {
    width: '2rem',
    getContent() {
      return <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />;
    }
  }
];

export default function TagTree({ tagCatalog, query, onChange }) {
  const tagTreeNodes = filterCatalog(tagCatalog, query).tagTree;
  return (
    <>
      {tagTreeNodes.map(group => (
        <ListGroup key={group.label} label={group.label}>
          {group.children.map(child => (
            <OverlayOption
              key={child.label}
              className={locals.option}
              onChange={onChange}
              size="compact"
              // clicking a group does not close the overlay
              close={() => {}}
              value={child}
            >
              <ColumnizedContent columnDefinitions={columnDefinitions} child={child} />
            </OverlayOption>
          ))}
        </ListGroup>
      ))}
    </>
  );
}

TagTree.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
