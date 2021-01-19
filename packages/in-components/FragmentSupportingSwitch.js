/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Switch } from 'react-router-dom';
import React, { Fragment } from 'react';

// react-router doesn't have any support in <Switch /> for fragments. This component
// wraps react-router's <Switch /> so that it gets fragment support.
//
// This ticket and the accompanying comment describe our use case in the react-router
// repository:
//
// https://github.com/ReactTraining/react-router/issues/5785
export default function FragmentSupportingSwitch({ children }) {
  const flattenedChildren = [];
  flatten(flattenedChildren, children);
  return React.createElement.apply(React, [Switch, null].concat(flattenedChildren));
}

function flatten(target, children) {
  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      if (child.type === Fragment) {
        flatten(target, child.props.children);
      } else {
        target.push(child);
      }
    }
  });
}
