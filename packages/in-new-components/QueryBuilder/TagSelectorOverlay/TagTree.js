import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

import filterCatalog from 'in-new-components/QueryBuilder/TagSelectorOverlay/tagCatalogFilter';
import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { ColumnizedContent } from 'in-new-components/lists/List';
import { ListGroup } from 'in-new-components/lists/List/List';
import { isBlank } from 'in-services/util/string';
import keyCodes from 'in-components/keyCodes';
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
    getContent({ child, query }) {
      if (isBlank(query)) {
        return null;
      }

      const filteredNumberOfChildren = child.children.length;
      const totalNumberOfUnfilteredChildren = child.originalChildren?.length ?? filteredNumberOfChildren;

      return (
        <span className={locals.childCount}>
          <strong className={locals.filteredChildCount}>{filteredNumberOfChildren}</strong> out of{' '}
          {totalNumberOfUnfilteredChildren}
        </span>
      );
    }
  },
  {
    width: '2rem',
    getContent() {
      return <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />;
    }
  }
];

export default forwardRef(TagTree);

function TagTree({ tagCatalog, query, onChange }, ref) {
  const tagTreeNodes = filterCatalog(tagCatalog, query).tagTree;
  return (
    <div ref={ref} onKeyDown={onKeyDown}>
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
              <ColumnizedContent columnDefinitions={columnDefinitions} child={child} query={query} />
            </OverlayOption>
          ))}
        </ListGroup>
      ))}
    </div>
  );
}

export function onKeyDown(event) {
  // keyCode is deprecated and code is not yet supported everywhere
  const code = event.code ?? event.keyCode;
  if (code === keyCodes.arrows.right) {
    event.target.click();
  } else {
    onArrowKeyDownFocusSiblings(event);
  }
}

TagTree.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
