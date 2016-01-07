import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import './ClasspathLayouter.less';

const block = 'in-classpath-layouter';

const ClasspathLayouter = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const cp = this.props.snapshot.getIn(['data', 'jvm.cp']);
    const cpEntries = cp.split(/:|;/);
    const tree = {};
    let currentPath = '';

    cpEntries.forEach(path => {
      const pathTillJar = this.getPathTillJar(path);

      if (pathTillJar !== currentPath) {
        tree[pathTillJar] = [];
      }

      currentPath = pathTillJar;
      tree[pathTillJar].push(path);
    });

    return (
      <div className={block}>
        {Object.keys(tree).map(path => {
          const parentPath = path;
          const children = tree[path];

          return (
            <div key={path}
                 className={block + '__item'}>
              {parentPath}
              <div className={block + '__children'}>
                {children.map(child => {
                  return (
                    <div key={child}>
                      {child.slice(parentPath.length, child.length)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  },

  getPathTillJar(path) {
    let indexOfLastSlash = path.length;

    for (let i = path.length - 1; i > 0; i--) {
      const char = path[i];
      if (char === '/') {
        indexOfLastSlash = i;
        break;
      }
    }

    return path.slice(0, indexOfLastSlash + 1);
  }
});

export default ClasspathLayouter;
