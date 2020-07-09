import PropTypes from 'prop-types';
import React from 'react';

import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { ColumnizedContent } from 'in-new-components/lists/List';
import KeyValue from 'in-new-components/lists/KeyValue';
import { Ul } from 'in-new-components/lists/List/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TagTree.mless';

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ node }) {
      return <SvgIcon className={locals.icon} type={node.icon ?? 'lib_views_tag'} />;
    }
  },
  {
    getContent({ node }) {
      return <KeyValue value={node.label} label={node.description} inverted accentuated />;
    }
  }
];

export default function TreeNodeList({ nodes, onChange, close }) {
  return (
    <Ul framed="topBottom">
      {nodes.map(node => (
        <OverlayOption
          key={node.label}
          className={locals.option}
          onChange={node =>
            onChange({
              type: 'TAG_FILTER',
              name: node.tagName,
              operator: 'EQUALS'
            })
          }
          close={close}
          value={node}
        >
          <ColumnizedContent columnDefinitions={columnDefinitions} node={node} />
        </OverlayOption>
      ))}
    </Ul>
  );
}

TreeNodeList.propTypes = {
  nodes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
