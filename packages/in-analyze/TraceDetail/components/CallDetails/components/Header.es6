import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Header.mless';

export default function Header({ call, onClose }) {
  return (
    <div className={locals.header}>
      <CloseButton onClick={onClose} />
      <span className={locals.callLabel}>{call.label}</span>
      <EndpointTypeBadgeList types={[call.type]} />
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
