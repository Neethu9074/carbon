import React from 'react';

import { getColor } from 'in-applications/endpointTypes';
import SvgIcon from 'in-components/SvgIcon';
import Badge from 'in-new-components/Badge';

import locals from './Header.mless';

export default function Header({ call, callTreeNode, onClose }) {
  return (
    <div className={locals.header}>
      <CloseButton onClick={onClose} />
      <span className={locals.callLabel}>{call.label}</span>
      {callTreeNode.endpoint && (
        <Badge color={getColor(callTreeNode.endpoint.type)}>{callTreeNode.endpoint.type}</Badge>
      )}
    </div>
  );
}

function CloseButton({ onClick }) {
  return (
    <div className={locals.closeButton} onClick={onClick}>
      <SvgIcon className={locals.closeIcon} type="x" width={12} height={12} color="#3f636b" />
      Close
    </div>
  );
}
