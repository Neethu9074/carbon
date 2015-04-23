'use strict';

import THREE from 'three';

import SceneObject from './SceneObject';
import colors from '../colors';
import eventEmitter from '../eventEmitter';


export default class Host extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.getStickNoteScreenPosition =
      this.getStickNoteScreenPosition.bind(this);
    this.update = this.update.bind(this);

    this.id = snapshot.get('hostId');
    this.render();
    this.addStickyNote();
    this.registerEvents();
	}

	registerEvents() {
    const update = this.update;
		this.subscription = eventEmitter.on('endUpdate').subscribe(
			//onEmit
			function(data) {
				update(data);
			}
    );
  }

  render() {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x232d36,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });

    const matB = new THREE.MeshBasicMaterial({
      color: 0x323d45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });
    const matC = new THREE.MeshBasicMaterial({
      color: 0x37424a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending
    });

    const mats = [
      mat, matB, matC, mat, matB, matC
    ];
    const finalMat = new THREE.MeshFaceMaterial(mats);

    this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), finalMat);
    this.addSceneObject(this.cube);
  }

  addStickyNote() {
    const topOfCube = new THREE.Vector3(0, 0.5, 0);
    this.stickNotePosition = new THREE.Vector3(0.5, 1, 0.5);

    const geo = new THREE.Geometry();
    geo.vertices.push(topOfCube);
    geo.vertices.push(this.stickNotePosition);

    const mat = new THREE.LineBasicMaterial({
      color: 0xA0A0A0
    });

    const line = new THREE.Line(geo, mat);
    this.cube.add(line);
  }

  update(data) {
    const worldPos = new THREE.Vector3();
    worldPos.applyMatrix4(this.cube.matrixWorld);

    const pos2D = this.getStickNoteScreenPosition(
      worldPos,
      data.scene.camera,
      data.scene.width,
      data.scene.height
    );
  }

  getStickNoteScreenPosition(position, camera, width, height) {
    const pos = position.clone();
    const projScreenMat = new THREE.Matrix4();
    projScreenMat.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse);
    pos.applyMatrix4(projScreenMat);

    return {
      x: (pos.x + 1) * width / 2,
      y: (-pos.y + 1) * height / 2
    };
  }

  setLocalPosition(position) {
    super.setLocalPosition(position);
    this.cube.position.copy(this.getWorldPosition());
  }
}
