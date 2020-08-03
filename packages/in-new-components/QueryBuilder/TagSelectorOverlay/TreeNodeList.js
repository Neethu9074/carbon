import PropTypes from 'prop-types';
import React from 'react';

import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { ColumnizedContent } from 'in-new-components/lists/List';
import KeyValue from 'in-new-components/lists/KeyValue';
import { Ul } from 'in-new-components/lists/List/List';
import keyCodes from 'in-components/keyCodes';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TagTree.mless';

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ node }) {
      return <SvgIcon className={locals.icon} type={node.icon ?? 'lib_views_tag'} />;
    }
  },
  {
    getContent({ node }) {
      return <KeyValue value={node.label} label={node.description} inverted accentuated />;
    }
  }
];

export default function TreeNodeList({ nodes, onChange, close, onSlideOut }) {
  return (
    <Ul framed="topBottom" onKeyDown={e => onKeyDown(e, onSlideOut)}>
      {nodes.map((node, i) => (
        <OverlayOption
          key={node.label}
          className={locals.option}
          onChange={node =>
            onChange({
              type: 'TAG_FILTER',
              name: node.tagName,
              operator: 'EQUALS'
            })
          }
          autoFocus={i === 0}
          close={close}
          value={node}
        >
          <ColumnizedContent columnDefinitions={columnDefinitions} node={node} />
        </OverlayOption>
      ))}
    </Ul>
  );
}

export function onKeyDown(event, onSlideOut) {
  // keyCode is deprecated and code is not yet supported everywhere
  const code = event.code ?? event.keyCode;
  if (code === keyCodes.arrows.left) {
    stopPropagationAndPreventDefault(event);
    onSlideOut();
  } else {
    onArrowKeyDownFocusSiblings(event);
  }
}

TreeNodeList.propTypes = {
  nodes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  onSlideOut: PropTypes.func.isRequired
};
