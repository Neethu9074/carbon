import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import ParticleEmitter from 'in-map/misc/ParticleEmitter/ParticleEmitter';

export default class ParticleEmitterComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_particleEmitter');

    this.particleEmitter = new ParticleEmitter(sceneObject);
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      this.sceneObject.eventEmitter.on('changePosition').subscribe(fromTo => {
        this.particleEmitter.setFromAndTo(fromTo.from, fromTo.to);
        this.particleEmitter.updateVertices();
      })
    );
  }

  dispose() {
    super.dispose();

    this.particleEmitter.dispose();
    this.particleEmitter = null;
  }
}
