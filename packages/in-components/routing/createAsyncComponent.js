import { createLogger } from '@instana/logger';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { getServerVersionTag, localTag } from 'in-services/uiClientVersion';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import ReloadUiDialog from 'in-components/ReloadUiDialog';

const logger = createLogger('in-components/AsyncFullscreenView');

const loadingIndicator = <LoadingIndicator size="xxxl" style={{ height: '100vh' }} />;
export const createAsyncViewComponent = createAsyncComponent.bind(null, loadingIndicator);

export const createAsyncComponentWithLoadingIndicatorPlaceholder = createAsyncComponent.bind(
  null,
  <div>{loadingIndicator}</div>
);

export function createAsyncComponent(loadingPlaceholder, load) {
  let ResolvedComponent;

  return class extends React.Component {
    static displayName = `AsyncView`;

    state = {
      Component: ResolvedComponent
    };

    componentDidMount() {
      if (this.state.Component != null) {
        return;
      }

      load().then(
        resolvedModule => {
          ResolvedComponent = resolvedModule.default;
          if (!this.unmounted) {
            this.setState({
              Component: ResolvedComponent
            });
          }
        },
        err => {
          checkServerVersionTag(localTag);

          logger.error(`Failed to load async component`, err);
        }
      );
    }

    componentWillUnmount() {
      this.unmounted = true;
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

const checkServerVersionTag = localTag => {
  const serverBuildTag$ = getServerVersionTag();
  serverBuildTag$.once(result => {
    if (result.tag !== localTag) {
      addActiveDialog(<ReloadUiDialog />);
    }
  });
};
