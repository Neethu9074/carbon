import { createStore } from 'in-stores/store';

const particlesAreActive = createStore({
  name: 'logicalView/particlesAreActive',
  initialValue: false
});
export const particlesAreActive$ = particlesAreActive.observable;

export function toggleParticles() {
  particlesAreActive.applyStateMutation(isActive => !isActive);
}
