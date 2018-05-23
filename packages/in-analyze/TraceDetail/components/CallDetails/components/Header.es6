import React from 'react';

import { getColor } from 'in-applications/endpointTypes';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';

import locals from './Header.mless';

export default function Header({ call, callTreeNode, onClose }) {
  return (
    <div className={locals.header}>
      <CloseButton onClick={onClose} />
      <span className={locals.callLabel}>{call.label}</span>
      {callTreeNode.endpoint && (
        <Pill kind="light" color={getColor(callTreeNode.endpoint.type)}>
          {callTreeNode.endpoint.type}
        </Pill>
      )}
    </div>
  );
}

function CloseButton({ onClick }) {
  return (
    <div className={locals.closeButton} onClick={onClick}>
      <SvgIcon
        className={locals.closeIcon}
        onClick={onClick}
        aria-label="Close sidebar"
        type="lib_openclose_cancel"
        width={24}
        height={24}
      />
    </div>
  );
}
