import React, { Fragment } from 'react';

import locals from './TagList.mless';

export default function TagList({ tags }) {
  return (
    <>
      {tags.map(({ tag, value }, i) => (
        <Fragment key={i}>
          <Tag tag={tag} value={value} />
          {i < tags.length - 1 && <TagSpacer />}
        </Fragment>
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

function TagSpacer() {
  return <div className={locals.spacer} />;
}
