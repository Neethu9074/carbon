import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import 'in-map/components/stickyNotes/logical/Service/components/ExpandIcon.less';

const block = 'in-sticky-note-service-expand-icon';

export default function Icon({ expanded }) {
  let className = block;
  if (expanded) {
    className += ' ' + className + '--expanded';
  }

  return (
    <div className={className}>
      <SvgIcon
        type={expanded ? 'triangle_up' : 'triangle_down'}
        width={4}
        height={4}
        color={expanded ? '#000' : '#2d4048'}
        className={block + '__icon'}
      />
    </div>
  );
}
