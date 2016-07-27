import React from 'react';


const rpt = React.PropTypes;

const SceneObject = React.createClass({

  displayName: 'SceneObjectBehaviour',

  propTypes: {
    InstanceType: rpt.func.isRequired,
    params: rpt.object.isRequired
  },

  sceneObject: null,

  getInitialState() {
    return {
      children: [],
      updates: 0
    };
  },

  addSceneObject(InstanceType, params) {
    const children = this.state.children;
    children.push({
      InstanceType,
      params
    });
    this.setState(children);
  },

  componentWillMount() {
    this.sceneObject = new this.props.InstanceType(this, this.props.params);
    this.sceneObject.init();
  },

  componentDidMount() {
    this.sceneObject.initEvents();

    // register for update events
  },

  componentWillReceiveProps() {},
  shouldComponentUpdate() { return true; },
  componentWillUpdate() {},
  componentDidUpdate() {},

  componentWillUnmount() {
    this.sceneObject.dispose();
    this.sceneObject = null;
  },

  update() {
    this.setState({
      updates: this.state.updates++
    });
  },

  render() {
    const children = this.state.children;
    if (children.length === 0) {
      return null;
    }
    return (
      <div>
        {children.map(child =>
          <SceneObject key={child.params.id}
                       InstanceType={child.InstanceType}
                       params={child.params} />
        )}
      </div>
    );
  }
});

export default SceneObject;
