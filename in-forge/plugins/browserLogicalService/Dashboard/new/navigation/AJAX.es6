import React from 'react';

export default function AJAX({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      {snapshotId}
    </div>
  );
}
