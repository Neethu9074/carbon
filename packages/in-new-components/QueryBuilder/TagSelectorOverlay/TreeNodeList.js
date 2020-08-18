import PropTypes from 'prop-types';
import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import Tag from 'in-new-components/QueryBuilder/TagSelectorOverlay/Tag';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { Ul } from 'in-new-components/lists/List/List';
import keyCodes from 'in-components/keyCodes';

export default function TreeNodeList({ nodes, onChange, close, onSlideOut }) {
  return (
    <Ul framed="topBottom" onKeyDown={e => onKeyDown(e, onSlideOut)}>
      {nodes.map((node, i) => (
        <Tag key={node.label} node={node} close={close} onChange={onChange} autoFocus={i === 0} />
      ))}
    </Ul>
  );
}

function onKeyDown(event, onSlideOut) {
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
