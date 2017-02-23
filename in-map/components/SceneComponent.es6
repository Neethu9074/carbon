import React from 'react';

import StickyNoteHoster from 'in-map/components/stickyNotes/StickyNoteHoster';
import PhysicalMapComponent from 'in-map/components/physical/MapComponent';
import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import LogicalMapComponent from 'in-map/components/logical/MapComponent';
import TooltipHoster from 'in-map/components/tooltips/TooltipHoster';
import EmptyScene from 'in-map/sceneObjects/EmptyScene';
import {view$, types as views} from 'in-stores/view';
import Scene from 'in-map/sceneObjects/Scene';
import connectTo from 'in-hoc/connectTo';


export default sceneObjectComponent(props => {
  const webGlContext = props.webGlContext;
  if (!webGlContext) {
    return {
      InstanceType: EmptyScene,
      params: {}
    };
  }

  return {
    InstanceType: Scene,
    params: {
      id: 'main_scene',
      webGlContext,
      canvas: props.canvas,
      antialias: props.antialias
    }
  };
}, connectTo({
    view: view$
  }, SceneComponent)
);

function SceneComponent({view, sceneObject}) {
  if (sceneObject.isEmptyScene) {
    return null;
  }

  return (
    <div>
      <StickyNoteHoster />
      <TooltipHoster />
      {currentView(view, sceneObject)}
    </div>
  );
}

function currentView(view, sceneObject) {

  if (view === views.physical) {
    return (
      <PhysicalMapComponent scene={sceneObject} />
    );
  } else if (view === views.process) {
    return (
      <LogicalMapComponent scene={sceneObject} />
    );
  }

  return null;
}
