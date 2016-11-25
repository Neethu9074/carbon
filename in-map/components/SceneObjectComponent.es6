import React from 'react';


export default function SceneObjectComponent(getProps, ComposedComponent) {
  return React.createClass({

    displayName: 'SceneObjectComponent',

    sceneObject: null,

    componentWillMount() {
      const {InstanceType, params} = getProps(this.props);
      this.sceneObject = new InstanceType(params);
      this.sceneObject.init();
      this.sceneObject.initComponents();
    },

    componentDidMount() {
      this.sceneObject.initEvents();
      this.sceneObject.initialized();
    },

    componentWillReceiveProps() {},
    shouldComponentUpdate() { return true; },
    componentWillUpdate() {},
    componentDidUpdate() {},

    componentWillUnmount() {
      this.sceneObject.disposeEvents();
      this.sceneObject.dispose();
      this.sceneObject = null;
    },

    render() {
      return (
        <ComposedComponent {...this.props}
                           {...this.state}
                           sceneObject={this.sceneObject} />
      );
    }
  });
}
