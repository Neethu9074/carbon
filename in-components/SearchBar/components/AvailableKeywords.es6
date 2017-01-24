import React from 'react';

import MenuHeading from 'in-components/SearchBar/components/MenuHeading';
import {fieldsCategorized} from 'in-stores/search/fields';

import './AvailableKeywords.less';

const block = 'in-search-available-keywords';

export default function AvailableKeywords() {
  return (
    <div className={block}>
      <MenuHeading>
        Available Search Keywords
      </MenuHeading>

      <ul>
        {fieldsCategorized.children.map(node =>
          <Node node={node}
                key={node.name} />
        )}
      </ul>
    </div>
  );
}


function Node({node}) {
  const children = node.children;
  const fields = node.fields;

  return (
    <li>
      {node.name}

      {children.length > 0 ?
        <ul>
          {children.map(child =>
            <Node node={child}
                  key={child.name} />
          )}
        </ul>
      : null}

      {fields.length > 0 ?
        <ul>
          {fields.map(field =>
            <Field field={field}
                   key={field.keyword} />
          )}
        </ul>
      : null}
    </li>
  );
}


function Field({field}) {
  return (
    <li>{field.keyword}</li>
  );
}
