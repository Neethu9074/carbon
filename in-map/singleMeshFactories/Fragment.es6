export default function createFragment(id, sceneObject, contentProvider, additionalParams) {
  const fragment = {
    id,
    sceneObject,
    contentProvider
  };

  if (additionalParams) {
    fragment.additionalParams = additionalParams;
  }

  return fragment;
}
