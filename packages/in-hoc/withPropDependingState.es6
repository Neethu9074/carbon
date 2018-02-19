import shallowEquals from 'fbjs/lib/shallowEqual';
import { createFactory, Component } from 'react';
import { pick } from 'lodash';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';

// Sample usage
// withPropDependingState(
//   ['defaultOrderBy', 'defaultOrderDirection'],
//   ({defaultOrderBy, defaultOrderDirection}) => ({
//     orderBy: defaultOrderBy,
//     orderDirection: defaultOrderDirection,
//     page: 1
//   }),
//   'onChange',
//   (prevState, change) => default({}, changedTableConfig, change)
// )
export default (propNamesWhichResultInReset, onReset, reducerName, reducer) => BaseComponent => {
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
      if (!shallowEquals(pick(this.props), pick(nextProps))) {
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
