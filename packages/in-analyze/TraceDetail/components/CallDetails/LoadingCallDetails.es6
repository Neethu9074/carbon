import React, { Fragment } from 'react';

import HorizontalIndicator from 'in-new-components/Loading/HorizontalIndicator';
import Skeleton from 'in-new-components/Loading/Skeleton';
import SvgIcon from 'in-components/SvgIcon';

import headerLocals from 'in-analyze/TraceDetail/components/CallDetails/components/Header.mless';
import locals from './LoadingCallDetails.mless';

export default function LoadingCallDetails({ onClose, progress }) {
  return (
    <Fragment>
      <div className={headerLocals.header}>
        <CloseButton onClick={onClose} />
        <Skeleton className={locals.labelSkeleton} />
      </div>
      <HorizontalIndicator progress={progress} />
    </Fragment>
  );
}

function CloseButton({ onClick }) {
  return (
    <div className={headerLocals.closeButton} onClick={onClick}>
      <SvgIcon className={headerLocals.closeIcon} type="x" width={12} height={12} color="#3f636b" />
      Close
    </div>
  );
}
