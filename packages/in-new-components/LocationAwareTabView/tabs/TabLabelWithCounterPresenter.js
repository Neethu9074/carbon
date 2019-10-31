import React from 'react';

export default function TabLabelWithCounterPresenter({ label, resultPropName, countersResult }) {
  if (!countersResult || !countersResult.data || countersResult.data[resultPropName] === undefined) {
    return <span>{label}</span>;
  }

  return (
    <span>
      {label} ({countersResult.data[resultPropName]})
    </span>
  );
}
