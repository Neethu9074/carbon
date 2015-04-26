'use strict';

import THREE from 'three';
import React from 'react';

import SceneObject from './SceneObject';
import colors from '../colors';
import StickyNote from './StickyNote';

const stickyNoteLineStartLocalPosition = new THREE.Vector3(0, 0.5, 0);
const stickyNoteLineEndLocalPosition = new THREE.Vector3(0.5, 0.8, 0);


export default class Host extends SceneObject {

  constructor({parent, snapshot, hostNumber}) {
    super({parent});

    this.id = snapshot.get('hostId');
    this.hostNumber = hostNumber;
    this.snapshot = snapshot;

    // TODO Ben get from Scene
    this.zoomLevel = 150;

    this.render();
    this.addStickyNote();
    this.registerEvents();
	}

	registerEvents() {
		this.addSubscription(
      this.on('endUpdate').subscribe(this.update.bind(this))
    );

    this.addSubscription(
      this.on('zoom').subscribe(this.onZoom.bind(this))
    );
  }

  render() {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x232d36,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const matB = new THREE.MeshBasicMaterial({
      color: 0x323d45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending,
      depthWrite: false

    });
    const matC = new THREE.MeshBasicMaterial({
      color: 0x37424a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending,
      depthWrite: false

    });

    const mats = [
      mat, matB, matC, mat, matB, matC
    ];
    const finalMat = new THREE.MeshFaceMaterial(mats);

    this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), finalMat);
    this.cube.position.y = 0.5;
    this.addSceneObject(this.cube);
  }

  addStickyNote() {
    const geo = new THREE.Geometry();
    geo.vertices.push(
      stickyNoteLineStartLocalPosition,
      stickyNoteLineEndLocalPosition
    );

    const mat = new THREE.LineBasicMaterial({
      color: 0xA0A0A0
    });

    const line = new THREE.Line(geo, mat);
    this.cube.add(line);

    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainer.classList.add('in-sticky-note');
    this.getHtmlContainer().appendChild(this.stickyNoteContainer);

    this.renderStickyNote();
  }

  update(data) {
    const worldPos = new THREE.Vector3();
    worldPos.applyMatrix4(this.cube.matrixWorld);
    worldPos.add(stickyNoteLineEndLocalPosition);

    const [x, y] = this.getStickNoteScreenPosition(
      worldPos,
      data.scene.camera,
      data.scene.width,
      data.scene.height
    );

    this.stickyNoteContainer.style.top = y + 'px';
    this.stickyNoteContainer.style.left = x + 'px';
  }

  getStickNoteScreenPosition(position, camera, width, height) {
    const pos = position.clone();
    const projScreenMat = new THREE.Matrix4();
    projScreenMat.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse);
    pos.applyMatrix4(projScreenMat);

    return [
      (pos.x + 1) * width / 2,
      (-pos.y + 1) * height / 2
    ];
  }

  setPosition(position) {
    super.setPosition(position);
    this.cube.position.copy(position);
    this.cube.position.y = 0.5;
  }

  onSnapshotUpdate(snapshot) {
    this.snapshot = snapshot;
    this.renderStickyNote();
  }

  renderStickyNote() {
    React.render(
      <StickyNote snapshot={this.snapshot}
                  zoomLevel={this.zoomLevel}
                  hostNumber={this.hostNumber}/>,
      this.stickyNoteContainer
    );
  }

  onZoom(event) {
    this.zoomLevel = event.zoomLevel;
    this.renderStickyNote();
  }
}
