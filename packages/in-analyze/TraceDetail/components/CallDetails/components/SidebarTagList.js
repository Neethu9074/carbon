/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { createRef, useEffect, useState, forwardRef } from 'react';

import CopyToClipboard from 'in-components/CopyToClipboard';
import { compositeRef } from 'in-services/util/react';
import { Li, Ul } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

import locals from './SidebarTagList.mless';

export default function SidebarTagList({ tags }) {
  const TagLine = forwardRef(function TagLine({ name, value, valueRef }, ref) {
    return (
      <Li className={locals.root}>
        <div className={locals.key}>{name}</div>
        <div className={locals.value} ref={compositeRef(valueRef, ref)}>
          {value}
        </div>
        <div className={locals.clipboard}>
          <CopyToClipboard getText={() => value}>
            {ref => (
              <span ref={ref}>
                <Button kind="fixedInline" icon="lib_actions_copy" iconSize="xs" />
              </span>
            )}
          </CopyToClipboard>
        </div>
      </Li>
    );
  });

  function TagLineWithTooltipOnOverflow({ name, value }) {
    const valueRef = createRef();
    const [overflow, setOverflow] = useState(false);

    useEffect(() => {
      if (valueRef && valueRef.current) {
        setOverflow(valueRef.current.scrollWidth > valueRef.current.offsetWidth);
      }
    }, [valueRef]);

    if (overflow) {
      return (
        <Tooltip content={value}>
          <TagLine name={name} value={value} valueRef={valueRef} />
        </Tooltip>
      );
    }
    return <TagLine name={name} value={value} valueRef={valueRef} />;
  }

  return (
    <>
      {tags.length > 0 && (
        <div className={locals.tagsCard}>
          <Ul>
            {tags.map(({ name, value }, i) => (
              <TagLineWithTooltipOnOverflow key={i} name={name} value={value} />
            ))}
          </Ul>
        </div>
      )}
    </>
  );
}
