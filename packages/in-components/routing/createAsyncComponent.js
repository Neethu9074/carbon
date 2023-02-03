/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useRouteMatch, useHistory } from 'react-router';
import React from 'react';

import { createLogger } from '@instana/logger';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { getServerVersionTag, localTag } from 'in-services/uiClientVersion';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
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

export const renderAsyncRouteChildren = load => {
  const Component = createAsyncComponent(loadingIndicator, load);

  return <RenderWithRouteProps Component={Component} />;
};

export function RenderWithRouteProps({ Component }) {
  // inject the route props, simulate the old v5 Route render props:
  // https://v5.reactrouter.com/web/api/Route/route-props

  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  return <Component match={match} location={location} history={history} />;
}
