import React from 'react';

import { expandNestedSerializedJson } from 'in-services/util/json';
import { flatten } from 'in-forge/tracing/sdk/flatten';
import { Li, Ul } from 'in-new-components/lists/List';
import Card from 'in-new-components/Card';

import locals from './CustomDataDescriptionItem.mless';

export default function CustomDataDescriptionItem({ span }) {
  const custom = span.getIn(['data', 'sdk', 'custom', 'tags']);
  if (!custom) {
    return null;
  }

  const tags = flatten(expandNestedSerializedJson(custom.toJS()));

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <Card title={'Tags'} withoutPadding>
        <Ul>
          {Object.entries(tags).map(key => (
            <Li key={key[0]}>
              <div className={locals.key}>{key[0]}</div>
              <div className={locals.value}>{key[1]}</div>
            </Li>
          ))}
        </Ul>
      </Card>
    </div>
  );
}
