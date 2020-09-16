import PropTypes from 'prop-types';
import React from 'react';

import { ListGroup, ColumnizedContent } from 'in-new-components/lists/List/List';
import { node as nodePropType } from 'in-new-components/SelectorOverlay/props';
import KeyValue from 'in-new-components/lists/KeyValue';
import { Li } from 'in-new-components/lists/List/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Node.mless';

const iconColumnDefinition = {
  width: '2rem',
  getContent({ node }) {
    return <SvgIcon className={locals.icon} type={node.icon ?? 'lib_views_tag'} />;
  }
};

const labelColumnDefinition = {
  getContent({ node }) {
    return <KeyValue inverted accentuated value={node.label} label={node.description} />;
  }
};

const rightArrowColumnDefinition = {
  width: '2rem',
  getContent() {
    return <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />;
  }
};

const leafWithoutIconColumnDefinitions = [labelColumnDefinition];
const leafWithIconColumnDefinitions = [iconColumnDefinition, labelColumnDefinition];
const nodeWithoutIconColumnDefinitions = [labelColumnDefinition, rightArrowColumnDefinition];
const nodeWithIconColumnDefinitions = [iconColumnDefinition, labelColumnDefinition, rightArrowColumnDefinition];

export default function Node({ node, focusNode, onChange, withIcons, asListGroup }) {
  if (node.children == null || node.children.length === 0) {
    const columnDefinitions = withIcons ? leafWithIconColumnDefinitions : leafWithoutIconColumnDefinitions;
    return <Item node={node} onClick={() => onChange(node)} columnDefinitions={columnDefinitions} />;
  } else if (asListGroup) {
    return (
      <ListGroup label={node.label}>
        {node.children.map((node, i) => (
          <Node
            key={i}
            node={node}
            focusNode={focusNode}
            onChange={onChange}
            withIcons={withIcons}
            asListGroup={false}
          />
        ))}
      </ListGroup>
    );
  } else {
    const columnDefinitions = withIcons ? nodeWithIconColumnDefinitions : nodeWithoutIconColumnDefinitions;
    return <Item node={node} onClick={() => focusNode(node)} columnDefinitions={columnDefinitions} />;
  }
}

function Item({ node, onClick, columnDefinitions }) {
  return (
    <Li noAlternatingBg onClick={onClick} className={locals.option}>
      <ColumnizedContent columnDefinitions={columnDefinitions} node={node} />
    </Li>
  );
}

Node.propTypes = {
  node: nodePropType.isRequired,
  focusNode: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  withIcons: PropTypes.bool.isRequired,
  asListGroup: PropTypes.bool.isRequired
};
