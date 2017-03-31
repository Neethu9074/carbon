import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './SnapshotLink.less';

const block = 'in-snapshot-link';

export default connectTo(
  props => {
    return {
      href: getLinkToSnapshotInCurrentView(props.snapshotId)
    };
  },
  function SnapshotLink({ href, children }) {
    return (
      <a href={href} className={block}>
        {children}
      </a>
    );
  }
);
