import React from 'react';

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
  const custom = span.getIn(['data', 'sdk', 'custom', 'tags']).filter((value, key) => !blacklistedTags.includes(key));
  if (!custom || custom.isEmpty()) {
    return null;
  }

  const tags = flatten(expandNestedSerializedJson(custom.toJS()));

  function TagLine({ name, value }) {
    return (
      <Li className={locals.root}>
        <div className={locals.key}>{name}</div>
        <Tooltip content={value} ellipsisOnly>
          <div className={locals.value} id={name}>
            {value}
          </div>
          <div className={locals.clipboard}>
            <CopyToClipboard targetId={name}>
              {refSetter => (
                <span ref={refSetter}>
                  <Button kind="secondary" icon="lib_views_popup" iconSize="xs" />
                </span>
              )}
            </CopyToClipboard>
          </div>
        </Tooltip>
      </Li>
    );
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <Card title={'Tags'} withoutPadding>
        <Ul>
          {Object.entries(tags).map(key => (
            <TagLine name={key[0]} value={key[1]} key={key[0]} />
          ))}
        </Ul>
      </Card>
    </div>
  );
}
