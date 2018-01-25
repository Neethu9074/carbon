import shallowEquals from 'fbjs/lib/shallowEqual';
import { createFactory, Component } from 'react';
import { pick } from 'lodash';

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
    static displayName = 'WithPropDependingState for ' + (BaseComponent.displayName || BaseComponent.name);

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
        propDependingState: reducer(this.state.propDependingState, change)
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
