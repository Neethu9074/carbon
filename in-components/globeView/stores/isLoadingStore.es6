import {createStore} from 'in-stores/store';


const isLoading = createStore({
  name: 'globeview/isLoadingStore',
  initialValue: true
});
export const isLoading$ = isLoading.observable;


const resourceToLoad = {
  globeDiffuseMap: false,
  globeSpecularMap: false,
  globeNormalMap: false,
  cloudAlphaMap: false,
  globeEffectOverlayMap: false,
  globeEffectOuterGlowMap: false
};

export function resourceLoaded(name) {
  resourceToLoad[name] = true;
  const keys = Object.keys(resourceToLoad);

  isLoading.applyStateMutation(() => {
    for (let i = 0; i < keys.length; i++) {
      if (!resourceToLoad[keys[i]]) {
        return true;
      }
    }
    return false;
  });
}
