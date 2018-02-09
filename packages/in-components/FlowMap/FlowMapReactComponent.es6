import React from 'react';

import { isWebGLSupported, getWebGLCanvasContext } from 'in-map/services/webGL';
import { showHelp, closeHelpIfOpen } from 'in-stores/navigation/navigation';
import getElementDimensions from 'in-hoc/getElementDimensions';
import FlowMap from 'in-components/FlowMap/FlowMap';

import locals from './FlowMap.mless';

export default getElementDimensions(
  class extends React.Component {
    static displayName = 'FlowMapReactComponent';

    componentDidMount() {
      this.showHelpIfWebGLCantBeSetup();
      this.initFlowMap(this.props.rootNodeId);
    }

    componentWillUpdate(nextProps) {
      if (this.props.rootNodeId !== nextProps.rootNodeId) {
        this.initFlowMap(nextProps.rootNodeId);
      }
      if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
        this.flowMap.setSize(nextProps.width, nextProps.height);
      }
    }

    componentWillUnmount() {
      if (this.flowMap) {
        this.flowMap.dispose();
      }
    }

    initFlowMap(rootNodeId) {
      if (isWebGLSupported() && this.webGlContext) {
        if (this.flowMap) {
          this.flowMap.dispose();
        }
        this.flowMap = new FlowMap({
          canvas: this.canvas,
          overlayReactComponent: this.overlayReactComponent,
          rootNodeId,
          createDataFetchingService: this.props.createDataFetchingService
        });
      }
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

    showHelpIfWebGLCantBeSetup = () => {
      if (!isWebGLSupported()) {
        showHelp('webglNotSupported');
      } else if (!this.webGlContext) {
        showHelp('webglNotInitialized');
      } else {
        closeHelpIfOpen('webglNotSupported');
        closeHelpIfOpen('webglNotInitialized');
      }
    };
  }
);
