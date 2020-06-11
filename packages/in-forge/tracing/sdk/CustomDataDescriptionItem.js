import React, { createRef, useEffect, useState } from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { expandNestedSerializedJson } from 'in-services/util/json';
import { Dl } from 'in-new-components/HorizontalDescriptionList';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { flatten } from 'in-forge/tracing/sdk/flatten';
import { Li, Ul } from 'in-new-components/lists/List';

import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';

import locals from './CustomDataDescriptionItem.mless';

const speciallyRenderedTags = [
  // span.data.sdk.custom.tags.message is to be rendered using ErrorDescriptionItem
  'message'
];

export default function CustomDataDescriptionItem({ span }) {
  let custom = span.getIn(['data', 'sdk', 'custom', 'tags']);
  if (!custom || custom.isEmpty()) {
    return null;
  }
  const errorMessage = span.getIn(['data', 'sdk', 'custom', 'tags', 'message']);
  custom = custom.filter((value, key) => !speciallyRenderedTags.includes(key));

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
    <>
      {errorMessage && (
        <Dl>
          <ErrorDescriptionItem error={errorMessage} />
        </Dl>
      )}
      {custom.isEmpty() || (
        <div className={locals.tagsCard}>
          <Card title={'Tags'} withoutPadding>
            <Ul>
              {Object.entries(tags).map(key => (
                <TagLineWithTooltipOnOverflow name={key[0]} value={key[1]} key={key[0]} />
              ))}
            </Ul>
          </Card>
        </div>
      )}
    </>
  );
}
