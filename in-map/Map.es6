import rpt from 'prop-types';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import { showHelp, closeHelpIfOpen } from 'in-stores/navigation/navigation';
import { isWebGLSupported, isContextLost$ } from 'in-map/services/webGL';
import { canvas$, setCanvas, clear } from 'in-map/stores/indexStore';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import MapNoContentMessage from 'in-components/MapNoContentMessage';
import { getWebGLCanvasContext } from 'in-map/services/webGL';
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
      let className = block;

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
    };
  }
);
