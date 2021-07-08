/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getWebGLCanvasContext, isWebGLSupported } from 'in-map/services/webGL';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import HelpDialog from 'in-components/helpSystem/HelpDialog';
import FlowMap from 'in-applications/FlowMap/FlowMap';
import { t } from 'in-i18n';

import locals from './FlowMap.mless';

export default function FlowMapReactComponentWrapper(props) {
  const { ref, ...dimensions } = useResizeObserverCustom();
  return (
    <div ref={ref}>
      <FlowMapReactComponent {...props} {...dimensions} />
    </div>
  );
}

class FlowMapReactComponent extends React.Component {
  componentDidMount() {
    this.showHelpIfWebGLCantBeSetup();
    this.initFlowMap(this.props);
    if (this.flowMap && this.props.flowMapState) {
      this.flowMap.updateState(this.props.flowMapState);
    }
  }

  componentDidUpdate(prevProps) {
    const currentProps = this.props;
    if (prevProps.flowMapState && !currentProps.flowMapState) {
      this.disposeFlowMapIfPresent();
    } else if (!prevProps.flowMapState && currentProps.flowMapState) {
      if (!this.flowMap) {
        this.initFlowMap(currentProps);
      }
      if (this.flowMap) {
        this.flowMap.updateState(currentProps.flowMapState);
      }
    } else {
      const flowMapStateHasChanged = prevProps.flowMapStateVersion !== currentProps.flowMapStateVersion;
      if (flowMapStateHasChanged) {
        if (!this.flowMap) {
          this.initFlowMap(currentProps);
        }
        if (this.flowMap) {
          this.flowMap.updateState(currentProps.flowMapState);
        }
      }
    }
    if (
      prevProps.width !== currentProps.width ||
      prevProps.height !== currentProps.height ||
      prevProps.customHeight !== currentProps.customHeight
    ) {
      if (this.flowMap) {
        this.flowMap.setSize(currentProps.width, currentProps.customHeight || currentProps.height);
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
      addActiveDialog(
        <HelpDialog
          title={t('in-applications:applicationMap.webglNotSupportedTitle')}
          markdownContent={t('in-applications:applicationMap.webglNotSupported')}
        />
      );
    } else if (!this.webGlContext) {
      addActiveDialog(
        <HelpDialog
          title={t('in-applications:applicationMap.webglNotInitializedTitle')}
          markdownContent={t('in-applications:applicationMap.webglNotInitialized')}
        />
      );
    }
  };
}
