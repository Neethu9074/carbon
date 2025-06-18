/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';

import { Li, Ul, Button } from '@instana/components';

import CopyToClipboard from 'in-components/CopyToClipboard';
import Tooltip from 'in-components/Tooltip';

import locals from './SidebarTagList.mless';

export default function SidebarTagList({ leftAligned = false, tags, noMargin }) {
  //Using this just to force a rerender on resize since a ref is used to check for overflow in the TagLines
  const [, setResized] = useState();
  const ref = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        window.requestAnimationFrame(() => {
          setResized({});
        });
      }, 300)
    );

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (tags.length > 0)
    return (
      <div ref={ref} className={noMargin ? locals.tagsCardNoMargin : locals.tagsCard}>
        <Ul>
          {tags.map(({ name, value }, i) => (
            <TagLine key={i} name={name} value={value} leftAligned={leftAligned} />
          ))}
        </Ul>
      </div>
    );

  return null;
}

const joinIfArray = value => {
  return typeof value === 'object' ? value.join(',') : value;
};

function TagLine({ name, value, leftAligned }) {
  const valueRef = useRef(null);

  const overflow = valueRef.current?.scrollWidth > valueRef.current?.offsetWidth;

  return (
    <Li className={locals.root}>
      <section className={locals.tooltipWrapper}>
        <Tooltip content={overflow ? joinIfArray(value) : undefined}>
          <section className={locals.wrapper}>
            <div className={locals.key}>{name}</div>
            <div
              ref={valueRef}
              className={classNames({
                [locals.rightAlignedValue]: !leftAligned,
                [locals.leftAlignedValue]: leftAligned
              })}
            >
              {joinIfArray(value)}
            </div>
            <div className={locals.clipboard}>
              <CopyToClipboard getText={() => joinIfArray(value)}>
                {ref => (
                  <span ref={ref}>
                    <Button kind="secondary" icon="lib_actions_copy" iconSize="xs" />
                  </span>
                )}
              </CopyToClipboard>
            </div>
          </section>
        </Tooltip>
      </section>
    </Li>
  );
}
