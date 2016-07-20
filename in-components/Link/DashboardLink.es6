import React from 'react';

export default function DashboardLink({snapshotId, children}) {
  const href = `/#/dashboard?snapshotId=${encodeURIComponent(snapshotId)}`;
  return (
    <a href={href}
       onClick={stopPropagation}>
      {children}
    </a>
  );
}

function stopPropagation(e) {
  e.stopPropagation();
}
