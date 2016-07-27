import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import Service from 'in-map/sceneObjects/logical/Service';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Service,
    params: {
      id: props.entity.get('id'),
      entity: props.entity
    }
  };
}, ServiceComponent);

function ServiceComponent() {
  return null;
}
