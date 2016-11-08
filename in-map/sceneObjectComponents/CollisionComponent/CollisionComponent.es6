import {combineLatest} from 'reactive-observables';

import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {MeshBasicMaterial, Mesh} from 'in-map/3DLibProvider';


const COLLISION_MESH_MATERIAL = new MeshBasicMaterial();

export default class CollisionComponent extends SceneObjectComponent {

  constructor(sceneObject, collisionGeometry, layerId, dashboardId) {
    super(sceneObject, '_collision');

    this.layerId = layerId;

    const mesh = this.collisionMesh = new Mesh(
      collisionGeometry,
      COLLISION_MESH_MATERIAL
    );
    mesh.dashboardId = dashboardId || sceneObject.id;
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

        PhysicsServiceLocator.removeCollisionObject(mesh, this.layerId);
        PhysicsServiceLocator.addCollisionObject(mesh, this.layerId);
      })
    );
  }

  dispose() {
    super.dispose();

    PhysicsServiceLocator.removeCollisionObject(this.collisionMesh, this.layerId);

    this.collisionMesh = null;
    this.layerId = null;
  }
}
