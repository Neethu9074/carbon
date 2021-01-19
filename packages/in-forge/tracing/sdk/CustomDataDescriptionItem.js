/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { createRef, useEffect, useState, forwardRef } from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { expandNestedSerializedJson } from 'in-services/util/json';
import { Dl } from 'in-new-components/HorizontalDescriptionList';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { flatten } from 'in-forge/tracing/sdk/flatten';
import { compositeRef } from 'in-services/util/react';
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
                <TagLineWithTooltipOnOverflow name={key[0]} value={String(key[1])} key={key[0]} />
              ))}
            </Ul>
          </Card>
        </div>
      )}
    </>
  );
}
