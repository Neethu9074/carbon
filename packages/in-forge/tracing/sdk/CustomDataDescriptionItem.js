import React, { createRef, useEffect, useState } from 'react';

import { expandNestedSerializedJson } from 'in-services/util/json';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { flatten } from 'in-forge/tracing/sdk/flatten';
import { Li, Ul } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';

import locals from './CustomDataDescriptionItem.mless';

const blacklistedTags = [
  // span.data.sdk.custom.tags.messages is to be rendered by the individual SDK span plug-in.
  'message'
];

export default function CustomDataDescriptionItem({ span }) {
  const custom = span.getIn(['data', 'sdk', 'custom', 'tags'])?.filter((value, key) => !blacklistedTags.includes(key));
  if (!custom || custom.isEmpty()) {
    return null;
  }

  function TagLine({ name, value, overflowComponentRef }) {
    return (
      <Li className={locals.root}>
        <div className={locals.key}>{name}</div>
        <div className={locals.value} ref={overflowComponentRef}>
          {value}
        </div>
        <div className={locals.clipboard}>
          <CopyToClipboard getText={() => value}>
            {refSetter => (
              <span ref={refSetter}>
                <Button kind="fixedInline" icon="lib_views_popup" iconSize="xs" />
              </span>
            )}
          </CopyToClipboard>
        </div>
      </Li>
    );
  }

  function TagLineWithTooltipOnOverflow({ name, value }) {
    const overflowComponentRef = createRef();
    const [overflow, setOverflow] = useState(false);

    useEffect(
      () => {
        if (overflowComponentRef && overflowComponentRef.current) {
          setOverflow(overflowComponentRef.current.scrollWidth > overflowComponentRef.current.offsetWidth);
        }
      },
      [overflowComponentRef]
    );

    if (overflow) {
      return (
        <Tooltip content={value}>
          <TagLine name={name} value={value} overflowComponentRef={overflowComponentRef} />
        </Tooltip>
      );
    }
    return <TagLine name={name} value={value} overflowComponentRef={overflowComponentRef} />;
  }

  const tags = flatten(expandNestedSerializedJson(custom.toJS()));

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <Card title={'Tags'} withoutPadding>
        <Ul>
          {Object.entries(tags).map(key => (
            <TagLineWithTooltipOnOverflow name={key[0]} value={key[1]} key={key[0]} />
          ))}
        </Ul>
      </Card>
    </div>
  );
}
