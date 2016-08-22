import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {collisionDetection} from 'in-map/misc/Physics';


const COLLISION_MESH_MATERIAL = new THREE.MeshBasicMaterial();

export default class CollisionComponent extends SceneObjectComponent {

  constructor(sceneObject, collisionGeometry, layerId) {
    super(sceneObject, '_collision');

    this.layerId = layerId;

    const mesh = this.collisionMesh = new THREE.Mesh(
      collisionGeometry,
      COLLISION_MESH_MATERIAL
    );
    mesh.parentSceneObject = sceneObject;
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.isEnabled = true;
  }

  initEvents() {
    const mesh = this.collisionMesh;

    this.addSubscription(
      combineLatest([
        this.sceneObject.eventEmitter.on('positionChanged'),
        this.sceneObject.eventEmitter.on('scaleChanged')
      ]).subscribe(([pos, scale]) => {
        mesh.position.set(pos.x, pos.y + scale.y / 2, pos.z);
        mesh.scale.copy(scale);

        mesh.updateMatrix();
        mesh.updateMatrixWorld();

        collisionDetection.removeCollisionObject(mesh, this.layerId);
        collisionDetection.addCollisionObject(mesh, this.layerId);
      })
    );
  }

  dispose() {
    super.dispose();

    collisionDetection.removeCollisionObject(this.collisionMesh, this.layerId);

    this.collisionMesh = null;
    this.layerId = null;
  }
}
