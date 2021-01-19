/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import * as webglNotInitialized from 'in-services/util/canvas/help-articles/webglNotInitialized.mmd';
import * as webglNotSupported from 'in-services/util/canvas/help-articles/webglNotSupported.mmd';
import { isWebGLSupported, getWebGLCanvasContext } from 'in-map/services/webGL';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import getElementDimensions from 'in-hoc/getElementDimensions';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import FlowMap from 'in-applications/FlowMap/FlowMap';

import locals from './FlowMap.mless';

export default getElementDimensions(
  class extends React.Component {
    static displayName = 'FlowMapReactComponent';

    componentDidMount() {
      this.showHelpIfWebGLCantBeSetup();
      this.initFlowMap(this.props);
      if (this.flowMap && this.props.flowMapState) {
        this.flowMap.updateState(this.props.flowMapState);
      }
    }

    UNSAFE_componentWillUpdate(nextProps) {
      if (this.props.flowMapState && !nextProps.flowMapState) {
        this.disposeFlowMapIfPresent();
      } else if (!this.props.flowMapState && nextProps.flowMapState) {
        if (!this.flowMap) {
          this.initFlowMap(nextProps);
        }
        if (this.flowMap) {
          this.flowMap.updateState(nextProps.flowMapState);
        }
      } else {
        const flowMapStateHasChanged = this.props.flowMapStateVersion !== nextProps.flowMapStateVersion;
        if (flowMapStateHasChanged) {
          if (!this.flowMap) {
            this.initFlowMap(nextProps);
          }
          if (this.flowMap) {
            this.flowMap.updateState(nextProps.flowMapState);
          }
        }
      }
      if (
        this.props.width !== nextProps.width ||
        this.props.height !== nextProps.height ||
        this.props.customHeight !== nextProps.customHeight
      ) {
        if (this.flowMap) {
          this.flowMap.setSize(nextProps.width, nextProps.customHeight || nextProps.height);
        }
      }
    }

    componentWillUnmount() {
      this.disposeFlowMapIfPresent();
    }

    render() {
      return (
        <div className={locals.wrapper}>
          <div className={locals.overlay} ref={overlay => (this.overlayReactComponent = overlay)} />
          <canvas
            className={locals.canvas}
            ref={canvas => {
              this.canvas = canvas;
              this.webGlContext = getWebGLCanvasContext(canvas);
            }}
          />
        </div>
      );
    }

    initFlowMap(props) {
      if (isWebGLSupported() && this.webGlContext) {
        this.disposeFlowMapIfPresent();
        this.flowMap = new FlowMap({
          canvas: this.canvas,
          overlayReactComponent: this.overlayReactComponent,
          expandNodeLeft: props.expandNodeLeft,
          expandNodeRight: props.expandNodeRight,
          expandChildLeft: props.expandChildLeft,
          expandChildRight: props.expandChildRight,
          loadMore: props.loadMore
        });
      }
    }

    disposeFlowMapIfPresent = () => {
      if (this.flowMap) {
        this.flowMap.dispose();
        this.flowMap = null;
      }
    };

    showHelpIfWebGLCantBeSetup = () => {
      if (!isWebGLSupported()) {
        addActiveDialog(<HelpDialog article={webglNotSupported} />);
      } else if (!this.webGlContext) {
        addActiveDialog(<HelpDialog article={webglNotInitialized} />);
      }
    };
  }
);
