import React from 'react';

export default function Users({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      {snapshotId}
    </div>
  );
}
