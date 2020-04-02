import rpt from 'prop-types';
import React from 'react';

const components = ['div', 'li'];

// For cases in which you want to treat a collection of elements as a single stack item.
export default function StackItem({ component = 'div', children }) {
  return React.createElement(component, undefined, children);
}

StackItem.propTypes = {
  component: rpt.oneOf(components),
  children: rpt.node
};
