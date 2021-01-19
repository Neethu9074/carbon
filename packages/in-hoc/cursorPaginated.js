/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { pick, curryRight, isEqual } from 'lodash';
import React, { Component } from 'react';

import { indeterminateProgress, finishedProgress, emptyArray } from 'in-services/fixedObjects';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { identity } from 'in-services/util/function';

// Usage:
// cursorPaginated({
//   getResettingProps: () => ['applicationId', 'serviceId', 'endpointId', 'timeConfig', 'orderBy', 'orderDirection'],
//   get: ({cursor, applicationId, serviceId, endpointId, timeConfig}) => getTraces({
//     pagination: {
//       cursor,
//       retrievalSize: 50
//     },
//     filter: {
//       application: applicationId,
//       service: serviceId,
//       endpoint: endpointId,
//       timeConfig
//     }
//   })
// })

export default ({ getResettingProps, get, loadMoreName = 'loadMore', reloadName = 'reload' }) => BaseComponent => {
  return class CursorPaginated extends Component {
    static displayName = getDisplayName(BaseComponent, 'cursorPaginated');

    constructor(props) {
      super(props);
      this.state = this.getResetState();
    }

    getResetState() {
      return {
        progress: finishedProgress,
        errors: emptyArray,
        totalHits: null,
        totalRepresentedItemCount: null,
        canLoadMore: true,
        items: emptyArray,
        next: null
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
      if (state.next) {
        return state.next;
      }
      return state.items[state.items.length - 1].cursor;
    }

    onLoadMoreUpdate = result => {
      if (result.data == null) {
        this.setState({
          progress: result.progress,
          errors: result.errors,
          time: result.time,
          canLoadMore: false
        });
      } else {
        this.setState(({ items, totalHits, totalRepresentedItemCount }) => ({
          progress: result.progress,
          adjustedWindowSize: result.adjustedWindowSize,
          errors: result.errors,
          time: result.time,
          canLoadMore: result.data.canLoadMore,
          totalHits: result.data.totalHits ?? totalHits,
          totalRepresentedItemCount: result.data.totalRepresentedItemCount ?? totalRepresentedItemCount,
          items: items.concat(result.data.items),
          next: result.data.next
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
      const props = {
        ...this.props,
        ...this.state,
        [loadMoreName]: this.loadMoreHandler,
        [reloadName]: this.reloadHandler
      };
      return <BaseComponent {...props} />;
    }
  };
};
