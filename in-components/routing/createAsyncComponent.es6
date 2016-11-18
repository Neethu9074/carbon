import {createLogger} from 'instalog';
import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import LoadingIndicator from 'in-components/LoadingIndicator';

const logger = createLogger('in-components/AsyncFullscreenView');

export const createAsyncFullscreenOverlayViewComponent = createAsyncComponent.bind(
  null,
  <FullscreenOverlayView>
    <LoadingIndicator type='dark' />
  </FullscreenOverlayView>
);

export function createAsyncComponent(loadingPlaceholder, load) {
  let ResolvedComponent;

  return React.createClass({
    displayName: `AsyncView`,

    getInitialState() {
      return {
        Component: ResolvedComponent
      };
    },

    componentWillMount() {
      if (this.state.Component != null) {
        return;
      }

      load()
        .then(_ResolvedComponent => {
          _ResolvedComponent = _ResolvedComponent.default;
          ResolvedComponent = _ResolvedComponent;
          this.setState({
            Component: _ResolvedComponent
          });
        }, err => {
          logger.error(`Failed to load async component`, err);
        });
    },

    render() {
      const Component = this.state.Component;
      if (Component) {
        return <Component {...this.props}/>;
      }

      return loadingPlaceholder;
    }
  });
}
