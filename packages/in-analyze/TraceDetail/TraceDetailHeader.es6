import React from 'react';

export default function TraceDetailHeader({ result }) {
  if (result.data == null) {
    return <div>Loading!</div>;
  }

  return <div>{result.data.label}</div>;
}
