import React from 'react';

import locals from './TagList.mless';

export default function TagList({ tags }) {
  return (
    <>
      {tags.map(({ tag, value }, i) => (
        <Tag key={i} tag={tag} value={value} />
      ))}
    </>
  );
}

function Tag({ tag, value }) {
  return (
    <>
      <span className={locals.label}>{tag.label}</span>
      <span className={locals.equals}>=</span>
      <span className={locals.value}>{value}</span>
    </>
  );
}
