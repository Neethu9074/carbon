import shallowEquals from 'fbjs/lib/shallowEqual';
import { createFactory, Component } from 'react';
import { pick, curryRight } from 'lodash';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { identity } from 'in-services/util/function';

// Sample usage
// withPropDependingState({
//   resettingProps: [
//     'columnDefinitions',
//     'defaultOrderBy',
//     'defaultOrderDirection',
//     'defaultPageSize',
//     'defaultQuery',
//     'get',
//     'paginationResettingProps'
//   ],
//   onReset: ({ columnDefinitions, defaultOrderBy, defaultOrderDirection, defaultPageSize, defaultQuery }) => ({
//     orderBy: defaultOrderBy || columnDefinitions[0].id,
//     orderDirection: defaultOrderDirection || 'ASC',
//     page: 1,
//     pageSize: defaultPageSize || 10,
//     query: defaultQuery || ''
//   }),
//   reducerName: 'onChange',
//   reducer: (prevState, change) => defaults({}, change, prevState)
// })(AnotherReactComponent)
export default ({ resettingProps = [], onReset, reducerName, reducer }) => BaseComponent => {
  const pickResettingProps = resettingProps.length > 0 ? curryRight(pick, 2)(resettingProps) : identity;

  const factory = createFactory(BaseComponent);
  return class WithPropDependingState extends Component {
    static displayName = getDisplayName(BaseComponent, 'WithPropDependingState');

    constructor(props) {
      super(props);
      this.state = {
        propDependingState: onReset(props)
      };
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEquals(pickResettingProps(this.props), pickResettingProps(nextProps))) {
        this.setState({
          propDependingState: onReset(nextProps)
        });
      }
    }

    reducer = change => {
      this.setState({
        propDependingState: reducer(this.state.propDependingState, change, this.props)
      });
    };

    render() {
      return factory({
        ...this.props,
        ...this.state.propDependingState,
        [reducerName]: this.reducer
      });
    }
  };
};
