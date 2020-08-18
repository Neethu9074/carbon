import PropTypes from 'prop-types';
import React from 'react';

import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { ColumnizedContent } from 'in-new-components/lists/List';
import KeyValue from 'in-new-components/lists/KeyValue';
import { isNotBlank } from 'in-services/util/string';
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
      if (isNotBlank(node.description)) {
        return <KeyValue value={node.label} label={node.description} inverted accentuated />;
      }
      return node.label;
    }
  }
];

export default function Tag({ node, onChange, close, autoFocus }) {
  return (
    <OverlayOption
      key={node.label}
      className={locals.option}
      onChange={() =>
        onChange({
          type: 'TAG_FILTER',
          name: node.tagName,
          operator: 'EQUALS'
        })
      }
      autoFocus={autoFocus}
      close={close}
      value={node}
    >
      <ColumnizedContent columnDefinitions={columnDefinitions} node={node} />
    </OverlayOption>
  );
}

Tag.propTypes = {
  node: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool
};
