import { combineLatest } from 'reactive-observables';

import { hexToRGB, rgbToHex } from 'in-services/formatters/color';

import ParticleEmitterComponent from 'in-map/sceneObjectComponents/ParticleEmitterComponent';
import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import LCP from 'in-map/singleMeshFactories/ContentProvider/LineContentProvider';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import {
  shortenPathAtSourceAndDestination,
  calculateLogicalCollisionMesh,
  addArrowToDestination,
  getCenterPosition,
  getOffsetVectors,
  intersects,
  flatten
} from 'in-map/misc/Connections';
import { CONNECTIONS_BIDIRECTIONAL_CHECK, CONNECTIONS_COLLISION_MESH_UPDATE } from 'in-map/misc/TimingConfig';
import ConnectionStickyNote from 'in-map/components/stickyNotes/logical/Connection';
import GhostConncetionSpawner from 'in-map/misc/logical/GhostConnectionSpawner';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotesStore';
import { showSticky$ } from 'in-map/stores/logical/connectionsStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import connections from 'in-map/stores/connectionsStore';
import { emptyArray } from 'in-services/fixedObjects';
import { theme } from 'in-services/theme';

export default class Connection extends SceneObject {
  constructor(params) {
    super(params);

    this.destinationNode = params.destinationNode;
    this.sourceNode = params.sourceNode;
    this.isBidirectional = false;
  }

  init() {
    super.init();

    stickyNotes.add(this.id, {
      type: ConnectionStickyNote,
      props: {
        id: this.id,
        eventEmitter: this.eventEmitter,
        showSticky$
      }
    });

    this.ghostConncetionSpawner = new GhostConncetionSpawner(this);
  }

  initComponents() {
    super.initComponents();

    this.lineContentProvider = new LCP(this.getVertices.bind(this), this.getColors.bind(this));
    this.addComponent('mesh', new MeshComponent(this, this.lineContentProvider, 'connections'));

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('screenPosition', new ScreenPositionComponent(this));

    this.addComponent('health', new HealthComponent(this));

    this.addComponent('particles', new ParticleEmitterComponent(this));

    this.getComponent('transform').setPositionXYZ(0, 0, 0);
  }

  initEvents() {
    super.initEvents();

    // if source and destination nodes were disposed, this check is true. This can happen when nodes
    // vanish and the conenctions are still active
    if (!this.sourceNode.eventEmitter || !this.destinationNode.eventEmitter) {
      return;
    }

    this.ghostConncetionSpawner.initEvents();

    this.addSubscriptions([
      combineLatest([
        this.sourceNode.eventEmitter.on('positionChanged'),
        this.destinationNode.eventEmitter.on('positionChanged'),
        this.eventEmitter.on('isBidirectionalChanged')
      ]).subscribe(([from, to]) => {
        from = from.clone();
        to = to.clone();
        this.addOffsetIfBidirectional(from, to);

        this.eventEmitter.emit('changePosition', { from, to });
      }),

      this.eventEmitter
        .on('changePosition')
        .subscribe(fromTo => this.eventEmitter.emit('positionChanged', getCenterPosition(fromTo.from, fromTo.to))),

      this.eventEmitter.on('changePosition').debounce(CONNECTIONS_COLLISION_MESH_UPDATE).subscribe(fromTo => {
        this.disposeCollisionLine();
        this.collisionLine = calculateLogicalCollisionMesh(fromTo.from, fromTo.to);
      }),
      combineLatest([
        this.eventEmitter.on('healthChanged'),
        this.eventEmitter.on('isHighlighted'),
        this.eventEmitter.on('isSecondaryHighlighted')
      ]).subscribe(([health, isHighlighted, isSecondaryHighlighted]) => {
        isHighlighted = isHighlighted || isSecondaryHighlighted;
        let newColor;

        const severity = health.get('maxSeverity', 0);
        if (severity > 0) {
          if (isHighlighted) {
            newColor = theme.health[Math.floor(severity)];
          } else {
            newColor = hexToRGB(theme.health[Math.floor(severity)]);
            newColor = rgbToHex(newColor.r * 0.65, newColor.g * 0.65, newColor.b * 0.65);
          }
        } else {
          newColor = isHighlighted ? '#ffffff' : '#5c6e74';
        }
        this.getComponent('color').setHex(newColor);
      }),
      connections.stream.throttle(CONNECTIONS_BIDIRECTIONAL_CHECK).subscribe(_connections => {
        let isBidirectional = false;
        const keys = Object.keys(_connections);
        for (let i = 0, length = keys.length; i < length; i++) {
          const connection = _connections[keys[i]];
          if (connection.sourceNode === this.destinationNode && connection.destinationNode === this.sourceNode) {
            isBidirectional = true;
            break;
          }
        }

        if (this.isBidirectional !== isBidirectional) {
          this.isBidirectional = isBidirectional;
          this.eventEmitter.emit('isBidirectionalChanged', isBidirectional);
        }
      })
    ]);

    this.eventEmitter.emit('isBidirectionalChanged', this.isBidirectional);
  }

  initialized() {
    super.initialized();

    connections.add(this.id, this);
  }

  getVertices() {
    const fromPosition = this.sourceNode.getPosition();
    const toPosition = this.destinationNode.getPosition();
    if (!fromPosition || !toPosition) {
      return emptyArray;
    }

    const from = fromPosition.clone();
    const to = toPosition.clone();
    this.addOffsetIfBidirectional(from, to);

    const path = flatten(addArrowToDestination(shortenPathAtSourceAndDestination([from, to])));

    return path;
  }

  getColors(vertices) {
    const colors = [];
    for (let i = 0, length = vertices.length; i < length; i++) {
      colors.push(1);
    }
    return colors;
  }

  intersects(raycaster) {
    return intersects(raycaster, this.collisionLine);
  }

  disposeCollisionLine() {
    if (this.collisionLine) {
      this.collisionLine.geometry.dispose();
      this.collisionLine = null;
    }
  }

  addOffsetIfBidirectional(from, to) {
    if (this.isBidirectional) {
      const offset = getOffsetVectors(from, to);

      from.add(offset.right);
      from.sub(offset.forward);
      to.add(offset.right);
      to.add(offset.forward);
    }
  }

  dispose() {
    super.dispose();

    stickyNotes.remove(this.id);
    connections.remove(this.id);

    this.ghostConncetionSpawner.dispose();
    this.disposeCollisionLine();

    this.lineContentProvider = null;
    this.destinationNode = null;
    this.sourceNode = null;
  }
}
