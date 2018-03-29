import { pick, curryRight, isEqual } from 'lodash';
import { createFactory, Component } from 'react';

import { indeterminateProgress, finishedProgress, emptyArray } from 'in-services/fixedObjects';
import { identity } from 'in-services/util/function';

// Usage:
// cursorPaginated({
//   getResettingProps: () => ['applicationId', 'serviceId', 'endpointId', 'timeframe', 'orderBy', 'orderDirection'],
//   get: ({cursor, applicationId, serviceId, endpointId, timeframe}) => getTraces({
//     pagination: {
//       cursor,
//       retrievalSize: 50
//     },
//     filter: {
//       application: applicationId,
//       service: serviceId,
//       endpoint: endpointId,
//       timeframe
//     }
//   })
// })

export default ({ getResettingProps, get, loadMoreName = 'loadMore', reloadName = 'reload' }) => BaseComponent => {
  const factory = createFactory(BaseComponent);
  return class CursorPaginated extends Component {
    constructor(props) {
      super(props);
      this.state = this.getResetState();
    }

    getResetState() {
      return {
        progress: finishedProgress,
        errors: emptyArray,
        totalHits: null,
        canLoadMore: true,
        items: emptyArray
      };
    }

    componentDidMount() {
      this.loadMore(this.props, this.state);
    }

    componentDidUpdate(prevProps) {
      const resettingProps = getResettingProps(this.props);
      const pickProps = resettingProps.length > 0 ? curryRight(pick, 2)(resettingProps) : identity;
      if (!isEqual(pickProps(prevProps), pickProps(this.props))) {
        this.reload(this.props);
      }
    }

    componentWillUnmount() {
      this.stopPendingLoad();
    }

    stopPendingLoad() {
      if (this.pendingLoad) {
        this.pendingLoad.dispose();
        this.pendingLoad = null;
      }
    }

    loadMore = (props, state) => {
      props = props || this.props;
      state = state || this.state;

      this.setState({
        progress: indeterminateProgress,
        errors: emptyArray,
        canLoadMore: false
      });
      this.pendingLoad = get({ ...props, cursor: this.getCursor(state) }).subscribe(this.onLoadMoreUpdate);
    };

    getCursor(state) {
      if (state.items.length === 0) {
        return null;
      }
      return state.items[state.items.length - 1].cursor;
    }

    onLoadMoreUpdate = result => {
      if (result.data == null) {
        this.setState({
          progress: result.progress,
          errors: result.errors,
          canLoadMore: false
        });
      } else {
        this.setState(({ items }) => ({
          progress: result.progress,
          errors: result.errors,
          canLoadMore: result.data.canLoadMore,
          totalHits: result.data.totalHits,
          items: items.concat(result.data.items)
        }));
      }

      if (!result.progress.loading) {
        this.stopPendingLoad();
      }
    };

    reload = props => {
      this.stopPendingLoad();
      const state = this.getResetState();
      this.setState(state);
      this.loadMore(props, state);
    };

    // we pass this down to the wrapper component in order to ensure that it cannot manipulate the props and state
    // parameter accidentially
    loadMoreHandler = () => this.loadMore(this.props, this.state);
    reloadHandler = () => this.reload(this.props);

    render() {
      return factory({
        ...this.props,
        ...this.state,
        [loadMoreName]: this.loadMoreHandler,
        [reloadName]: this.reloadHandler
      });
    }
  };
};
