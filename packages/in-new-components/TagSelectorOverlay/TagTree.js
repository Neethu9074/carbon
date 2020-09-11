import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import filterCatalog from 'in-new-components/TagSelectorOverlay/tagCatalogFilter';
import { ListGroup, ColumnizedContent } from 'in-new-components/lists/List/List';
import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { isBlank, isNotBlank } from 'in-services/util/string';
import Tag from 'in-new-components/TagSelectorOverlay/Tag';
import KeyValue from 'in-new-components/lists/KeyValue';
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
      if (isNotBlank(child.description)) {
        return <KeyValue value={child.label} label={child.description} inverted accentuated />;
      }
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

function TagTree({ tagCatalog, query, onChange, onChangeTag, close }, ref) {
  const tagTreeNodes = filterCatalog(tagCatalog, query).tagTree;
  return (
    <div ref={ref} onKeyDown={onKeyDown}>
      {tagTreeNodes.map(group => {
        if (group.type === 'TAG') {
          return <Tag key={group.label} node={group} close={close} onChange={onChangeTag} />;
        }

        return (
          <ListGroup key={group.label} label={group.label}>
            {group.children.map(child => {
              if (child.type === 'TAG') {
                return <Tag key={'tag-' + child.label} node={child} close={close} onChange={onChangeTag} />;
              }

              return (
                <OverlayOption
                  key={'child-' + child.label}
                  className={locals.option}
                  onChange={onChange}
                  size="compact"
                  // clicking a group does not close the overlay
                  close={() => {}}
                  value={child}
                >
                  <ColumnizedContent columnDefinitions={columnDefinitions} child={child} query={query} />
                </OverlayOption>
              );
            })}
          </ListGroup>
        );
      })}
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
  onChange: PropTypes.func.isRequired,
  onChangeTag: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
