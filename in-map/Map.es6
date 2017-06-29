import rpt from 'prop-types';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import { isWebVRSupported, createNoWebVRDialog } from 'in-map/services/webVR';
import { showHelp, closeHelpIfOpen } from 'in-stores/navigation/navigation';
import { isWebGLSupported, isContextLost$ } from 'in-map/services/webGL';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { canvas$, setCanvas, clear } from 'in-map/stores/indexStore';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import MapNoContentMessage from 'in-components/MapNoContentMessage';
import { getWebGLCanvasContext } from 'in-map/services/webGL';
import { webVRIsActive } from 'in-map/stores/webVRStore';
import { getSetting$ } from 'in-services/settings';
import SceneGraph from 'in-map/SceneGraph';
import connectTo from 'in-hoc/connectTo';
import 'in-map/Map.less';

const block = 'in-map';

export default connectTo(
  {
    antialias: getSetting$('map_antialias'),
    isContextLost: isContextLost$,
    canvas: canvas$
  },
  class extends React.Component {
    static displayName = 'Map';

    static propTypes = {
      isContextLost: rpt.bool,
      antialias: rpt.string,
      webVRMode: rpt.bool,
      canvas: rpt.object
    };

    componentDidMount() {
      const canvas = this.mainCanvas;
      this.checkDialogs();
      if (isWebGLSupported() && !this.props.isContextLost) {
        setCanvas(canvas);
      }

      this.sceneGraph = new SceneGraph(canvas, this.props.antialias, this.webGlContext);
    }

    componentDidUpdate(prevProps) {
      if (prevProps.canvas !== this.props.canvas) {
        this.checkDialogs();
      }
    }

    componentWillUnmount() {
      clear();

      // null check everything which was created in componentDidMount
      if (this.sceneGraph) {
        this.sceneGraph.dispose();
      }
    }

    render() {
      const webVRMode = this.props.webVRMode;

      let className = block;
      if (webVRMode) {
        className += ` ${block}--webvr`;
      }

      // set global VR flag
      webVRIsActive(webVRMode ? true : false);

      return (
        <div>
          <DashboardNavigationRoute />
          <div className={className}>
            <canvas
              className={`${block}__canvas`}
              ref={canvas => {
                this.mainCanvas = canvas;
                this.webGlContext = getWebGLCanvasContext(canvas);
              }}
            />
            <StickyNoteHoster />
            <TooltipHoster />
            <MapNoContentMessage />
          </div>
        </div>
      );
    }

    checkDialogs = () => {
      if (!isWebGLSupported() || this.props.isContextLost) {
        showHelp('webglNotSupported');
      } else if (!this.webGlContext) {
        showHelp('webglNotInitialized');
      } else {
        closeHelpIfOpen('webglNotSupported');
        closeHelpIfOpen('webglNotInitialized');
      }

      if (this.props.webVRMode && !isWebVRSupported()) {
        // diasable this for a while to allow working with this branch without any VR headset connected
        setActiveDialog(createNoWebVRDialog());
      }
    };
  }
);
