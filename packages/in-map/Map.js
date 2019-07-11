import rpt from 'prop-types';
import React from 'react';

import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import { getViewStructure } from 'in-map/stores/physical/viewStructureStore';
import { showHelp, closeHelpIfOpen } from 'in-stores/navigation/navigation';
import { isWebGLSupported, isContextLost$ } from 'in-map/services/webGL';
import { canvas$, setCanvas, clear } from 'in-map/stores/indexStore';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import MapNoContentMessage from 'in-components/MapNoContentMessage';
import NotMonitoringMap from 'in-map/components/NotMonitoringMap';
import { getWebGLCanvasContext } from 'in-map/services/webGL';
import { view$, types as views } from 'in-stores/view';
import { getSetting$ } from 'in-services/settings';
import SceneGraph from 'in-map/SceneGraph';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import 'in-map/stores/statisticsStore';

import 'in-map/Map.less';

const block = 'in-map';

export default function Wrapper(props) {
  return (
    <WithEmptyStateFallback getHasDataToRender={getHasDataToRender} FallbackComponent={NotMonitoringMap}>
      <MapReactComponent {...props} />
    </WithEmptyStateFallback>
  );
}

const MapReactComponent = connectTo(
  {
    antialias: getSetting$('map_antialias'),
    isContextLost: isContextLost$,
    canvas: canvas$,
    view: view$
  },
  class extends React.Component {
    static displayName = 'Map';

    static propTypes = {
      isContextLost: rpt.bool,
      isDataAvailable: rpt.bool,
      antialias: rpt.string,
      canvas: rpt.object,
      view: rpt.string
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

    getTitle() {
      switch (this.props.view) {
        case views.container:
          return 'Infrastructure Container Map';
        case views.physical:
          return 'Infrastructure Host Map';
        default:
          return 'Unknown view';
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
        <div className={className}>
          <Title title={this.getTitle()} />
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

function getHasDataToRender() {
  return getViewStructure().map(structure => structure.viewStructure.children.length > 0);
}
