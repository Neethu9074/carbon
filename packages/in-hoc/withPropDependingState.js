/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { pick, curryRight, defaults } from 'lodash';
import shallowEquals from 'fbjs/lib/shallowEqual';
import React, { Component } from 'react';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { emptyArray } from 'in-services/fixedObjects';

// Sample usage
// withPropDependingState({
//   // given the props, define the initial state
//   getInitialState,
//
//   // define cases which should reset / change the URL state
//   resets: [
//     // reset the page to 1 when one of the properties changes that are used in get
//     {
//       getResettingProps: ({paginationResettingProps}) => paginationResettingProps || emptyArray,
//       onReset: () => ({ page: 1 })
//     },
//
//     // reset everything once one of the basic properties changes
//     {
//       getResettingProps: () => [
//         'columnDefinitions',
//         'defaultOrderBy',
//         'defaultOrderDirection',
//         'defaultPageSize',
//         'defaultQuery',
//         'get'
//       ],
//       onReset: getInitialState
//     }
//   ],
//
//   reducerName: 'onChange',
//   reducer: (prevState, change) => defaults({}, {foo: change}, prevState)
// })

export default ({
  getInitialState,
  resets = emptyArray,
  reducerName,
  reducer = defaultingReducer
}) => BaseComponent => {
  return class WithPropDependingState extends Component {
    static displayName = getDisplayName(BaseComponent, 'WithPropDependingState');

    constructor(props) {
      super(props);
      this.state = {
        propDependingState: getInitialState(props)
      };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      let resetExecuted = false;
      const resultingState = resets.reduce((newState, { getResettingProps, onReset }) => {
        const pickResettingProps = curryRight(pick, 2)(getResettingProps(nextProps));
        if (shallowEquals(pickResettingProps(this.props), pickResettingProps(nextProps))) {
          return newState;
        }

        resetExecuted = true;
        return defaults({}, onReset(nextProps), newState);
      }, defaults({}, this.state.propDependingState));

      if (resetExecuted) {
        this.setState({
          propDependingState: resultingState
        });
      }
    }

    reducer = change => {
      this.setState({
        propDependingState: reducer(this.state.propDependingState, change, this.props)
      });
    };

    render() {
      const props = {
        ...this.props,
        ...this.state.propDependingState,
        [reducerName]: this.reducer
      };
      return <BaseComponent {...props} />;
    }
  };
};

function defaultingReducer(prevState, change) {
  return defaults({}, change, prevState);
}
