import THREE from 'three';

import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import HighlightingComponent from 'in-map/src/components/process/HighlightingComponent';
import CollisionComponent from 'in-map/src/components/common/CollisionObjectComponent';
import MeshComponent from 'in-map/src/components/common/MeshComponent';

import CMCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ColorMultiplierContentManipulator';
import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import CCP from 'in-map/src/SingleMeshFactory/ContentProvider/CubeContentProvider';

import {cubeGeometry, defaultGeometryMaterial} from 'in-map/src/3DSceneObjects/common/geometries';
import StickyNoteMetric from 'in-map/src/2DSceneObjects/stickyNotes/process/node/KPI/Physical';
import Node from 'in-map/src/3DSceneObjects/process/Node';


export default class NodePhysical extends Node {

  constructor(props) {
    super(props);
  }

  addComponents(components) {
    const factory = this.getFactory('solidSMF');
    const sceneObject = this;

    // add the mesh component to handle visual representation of the entity
    components.mesh = new MeshComponent({
      sceneObject,
      contentProvider: new CMCM({
        contentProvider: new PCM({
          contentProvider: new SCM({
            contentProvider: new CCP()
          })
        })
      }),
      factory
    });

    // add the collision component to handle the collision box
    components.collision = new CollisionComponent({
      sceneObject,
      collisionObject: new THREE.Mesh(cubeGeometry, defaultGeometryMaterial),
      layer: 2
    });

    components.highlight = new HighlightingComponent({sceneObject});

    components.screenPositionCluster = new ScreenPositionComponent({
      sceneObject: this,
      id: '_screenPositionCluster'
    });

    components.screenPositionMetric = new ScreenPositionComponent({
      sceneObject: this,
      id: '_screenPositionMetric'
    });
  }

  createMetricSticky() {
    return new StickyNoteMetric(this);
  }
}
