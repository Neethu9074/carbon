import React from 'react';

import connectTo from 'in-hoc/connectTo';

import locals from './Children.mless';

export default function Children({ node }) {
  if (node.children.size === 0) {
    return null;
  }

  const children = [];
  const items = node.children.values();
  for (const child of items) {
    children.push(child);
  }

  return (
    <ul className={locals.children}>
      {children.map(child => (
        <li key={child.id} className={locals.child}>
          <Child child={child} />
          {child.label}
        </li>
      ))}
    </ul>
  );
}

const Child = connectTo(
  props => ({
    data: props.child.events$.on('data')
  }),
  function Child({ data }) {
    if (!data) {
      return null;
    }
    return <span>{data.label}</span>;
  }
);
