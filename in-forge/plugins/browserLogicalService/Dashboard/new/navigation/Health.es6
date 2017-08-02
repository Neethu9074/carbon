import React from 'react';

export default function Health({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      {snapshotId}
    </div>
  );
}
