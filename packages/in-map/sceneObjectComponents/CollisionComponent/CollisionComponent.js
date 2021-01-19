/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { MeshBasicMaterial, Mesh } from 'in-map/3DLibProvider';

const COLLISION_MESH_MATERIAL = new MeshBasicMaterial();

export default class CollisionComponent extends SceneObjectComponent {
  constructor(sceneObject, collisionGeometry, layerId, dashboardId) {
    super(sceneObject, '_collision');

    this.layerId = layerId;

    const mesh = (this.collisionMesh = new Mesh(collisionGeometry, COLLISION_MESH_MATERIAL));
    mesh.dashboardId = dashboardId || sceneObject.id;
    mesh.parentSceneObject = sceneObject;
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.isEnabled = true;

    PhysicsServiceLocator.addCollisionObject(mesh, this.layerId);
  }

  initEvents() {
    const updateCollisionObjectCallback = this.updateCollisionObject.bind(this);
    this.addSubscription(
      this.sceneObject.eventEmitter.on('transformationChanged').subscribe(updateCollisionObjectCallback)
    );
  }

  updateCollisionObject(transform) {
    const mesh = this.collisionMesh;
    mesh.position.set(transform.position.x, transform.position.y + transform.scale.y / 2, transform.position.z);
    mesh.scale.copy(transform.scale);

    mesh.updateMatrix();
    mesh.updateMatrixWorld();

    PhysicsServiceLocator.updateCollisionObject(mesh, this.layerId);
  }

  dispose() {
    super.dispose();

    PhysicsServiceLocator.removeCollisionObject(this.collisionMesh, this.layerId);

    this.collisionMesh = null;
    this.layerId = null;
  }
}
