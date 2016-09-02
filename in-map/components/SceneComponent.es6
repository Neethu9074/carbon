import React from 'react';

import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import PhysicalMapComponent from 'in-map/components/physical/MapComponent';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import LogicalMapComponent from 'in-map/components/logical/MapComponent';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import {view$, types as views} from 'in-stores/view';
import Scene from 'in-map/sceneObjects/Scene';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Scene,
    params: {
      id: 'main_scene',
      canvas: props.canvas,
      antialias: props.antialias,
      webVRMode: props.webVRMode
    }
  };
}, connectTo({
    view: view$
  }, SceneComponent)
);

function SceneComponent({view, sceneObject, webVRMode}) {
  return (
    <div>
      <StickyNoteHoster />
      <TooltipHoster />
      {currentView(view, sceneObject, webVRMode)}
    </div>
  );
}

function currentView(view, sceneObject, webVRMode) {

  if (view === views.physical) {
    return (
      <PhysicalMapComponent scene={sceneObject}
                            webVRMode={webVRMode} />
    );
  } else if (view === views.process) {
    return (
      <LogicalMapComponent scene={sceneObject}
                           webVRMode={webVRMode} />
    );
  }

  return null;
}
