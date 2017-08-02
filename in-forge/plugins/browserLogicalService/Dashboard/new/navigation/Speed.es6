import React from 'react';

export default function Speed({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      {snapshotId}
    </div>
  );
}
