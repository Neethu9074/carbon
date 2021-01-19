/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import Button from 'in-new-components/Button';

import './ClasspathLayouter.less';

const block = 'in-classpath-layouter';

export default class extends React.Component {
  static displayName = 'ClasspathLayouter';

  static propTypes = {
    classpath: rpt.any
  };

  state = {
    visible: false
  };

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    const classpath = this.props.classpath;

    if (!classpath) {
      return null;
    }

    const cpEntries = classpath.split(/:|;/);
    const tree = {};
    let currentPath = '';

    cpEntries.forEach(path => {
      const pathTillJar = getPathTillJar(path);

      if (pathTillJar !== currentPath || !tree[pathTillJar]) {
        tree[pathTillJar] = [];
      }

      currentPath = pathTillJar;
      tree[pathTillJar].push(path);
    });

    return (
      <div className={block}>
        {cpEntries.length > 5 ? (
          <Button onClick={this.toggleVisibility} kind="secondary" className={`${block}__toggle`}>
            {this.state.visible ? 'Hide Classpath' : 'Show Classpath'}
          </Button>
        ) : null}

        {this.state.visible || cpEntries.length <= 5
          ? Object.keys(tree).map((path, i) => {
              const parentPath = path;
              const children = tree[path];

              return (
                // Classpaths may very well contain duplicate entries.
                // Using the index here deliberately to cater for this.
                <div key={i} className={block + '__item'}>
                  {parentPath}
                  <div className={block + '__children'}>
                    {children.map((child, j) => {
                      return (
                        // Classpaths may very well contain duplicate entries.
                        // Using the index here deliberately to cater for this.
                        <div key={j}>{child.slice(parentPath.length, child.length)}</div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

function getPathTillJar(path) {
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
