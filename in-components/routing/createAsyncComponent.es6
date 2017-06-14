import { createLogger } from 'instalog';
import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import LoadingIndicator from 'in-components/LoadingIndicator';

const logger = createLogger('in-components/AsyncFullscreenView');

export const createAsyncFullscreenOverlayViewComponent = createAsyncComponent.bind(
  null,
  <FullscreenOverlayView>
    <LoadingIndicator type="dark" />
  </FullscreenOverlayView>
);

export const createAsyncComponentWithLoadingIndicatorPlaceholder = createAsyncComponent.bind(
  null,
  <div>
    <LoadingIndicator type="dark" />
  </div>
);

export function createAsyncComponent(loadingPlaceholder, load) {
  let ResolvedComponent;

  return class extends React.Component {
    static displayName = `AsyncView`;

    state = {
      Component: ResolvedComponent
    };

    componentWillMount() {
      if (this.state.Component != null) {
        return;
      }

      load().then(
        _ResolvedComponent => {
          _ResolvedComponent = _ResolvedComponent.default;
          ResolvedComponent = _ResolvedComponent;
          if (!this.unmount) {
            this.setState({
              Component: _ResolvedComponent
            });
          }
        },
        err => {
          logger.error(`Failed to load async component`, err);
        }
      );
    }

    componentWillUnmount() {
      this.unmount = true;
    }

    render() {
      const Component = this.state.Component;
      if (Component) {
        return <Component {...this.props} />;
      }

      return loadingPlaceholder;
    }
  };
}
