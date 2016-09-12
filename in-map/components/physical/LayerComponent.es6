import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import Layer from 'in-map/sceneObjects/physical/Layer';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Layer,
    params: {
      id: props.entity.get('id'),
      entity: props.entity,
      node: props.node,
      webVRMode: props.webVRMode
    }
  };
}, LayerComponent );

function LayerComponent({}) {
  return null;
}
