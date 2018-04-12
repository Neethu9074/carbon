import React from 'react';

// import SvgIcon from 'in-components/SvgIcon';

import locals from './CallStatus.mless';

export default function CallStatus({ call }) {
  return (
    <div className={locals.callStatus}>
      {/* <Status call={call} /> */}
      <ErrorIndicator errorCount={call.errorCount} />
    </div>
  );
}

// function Status() {
//   return (
//     <div className={locals.callStatusInformation}>
//       <SvgIcon className={locals.infoIcon} type="info" width={14} height={14} color="#47626A" />
//       Status 402
//     </div>
//   );
// }

function ErrorIndicator({ errorCount }) {
  if (errorCount < 1) {
    return null;
  }

  return (
    <div className={locals.errorIndicator}>
      <div className={locals.errorIconWrapper}>!</div>
      <span>{`${errorCount} Error${errorCount > 1 ? 's' : ''}`}</span>
    </div>
  );
}
