/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Children, useState } from 'react';

// eslint-disable-next-line no-restricted-imports
import { ComboBox } from '@carbon/react';
//@ts-expect-error
import locals from './CompTree.mless';


interface CompTreeProps {
  id?: string;
  pathTree: object;
  dependOn: object;
  dependBy: object;
  title?: string;
  filter?: string;
}

function DepList({title, path, map, filter} : {title: string, path: string, map: object, filter?: string}) {
  let pathList = path && map[path];
  if (pathList && (filter == "crossarea")) {
    const pathArea = path.split('/')[0];
    pathList = pathList.filter( (item) => {
      return item.split('/')[0] != pathArea;
    })
  }
  return (
    <div className={locals.columnContainer}>
      <div className={locals.columnTitle}>
        {title + ' (' + (pathList ? pathList.length : 0) + ' module' + ((pathList?.length > 1) ? 's' : '') +')'}
      </div>
      <div className={locals.listContainerOverflow}>
        { pathList && pathList.map( item =>
          <div className={locals.pathCell}> {item.replaceAll('-', '\u2011')} </div>
        )
        }
      </div>
    </div>
  )
}

function genPathLists(path: string[], map: object): string[][] {
  let lists: string[][] = [];
  if (path.length >= 1) {
    const mapKeys = Object.keys(map[path[0]]);
    if (mapKeys.length) {
      lists.push(mapKeys);
    }
  }
  if (path.length > 1) {
    lists = lists.concat(genPathLists(path.slice(1), map[path[0]]));
  }
  return lists;
}


function PathSelector({title, path, setPath, map} : {title: string, path: string[], setPath: Function, map: object}) {
  const onChange = (index, event) => {
    let newPath = path.slice();
    if (index >= newPath.length) {
      newPath.push(event.selectedItem);
    } else {
      newPath[index] = event.selectedItem;
      newPath = newPath.slice(0, index + 1);
    }
    setPath(newPath);
  }
  let pathLists: string[][] = [];
  pathLists.push(Object.keys(map));
  if (path.length) {
    pathLists = pathLists.concat(genPathLists(path, map));
  }
  return (
    <div className={locals.columnContainer}>
      <div className={locals.columnTitle}>
        {title}
      </div>
      <div className={locals.listContainer}>
        {pathLists.length && pathLists.map( (list, i) => {
          // eslint-disable-next-line react/jsx-no-bind
          return <ComboBox key={'pathCombo'+i} id={'pathCombo'+i} value={path[i] ?? ''} items={list} placeholder="Select a path" onChange={onChange.bind(this, i)} />
        })}
      </div>
    </div>
  )
}

export default function CompTree({
  id = 'CompTree',
  pathTree,
  dependOn,
  dependBy,
  title = 'Component dependency',
  filter
}: CompTreeProps) {
  const [path, setPath] = useState([]);

  return (
    <section
      id={id}
      aria-label="Component dependency map"
      className={locals.panel}
    >
      <hgroup className={locals.contentHeader}>
        <h1 className={locals.contentTitle}>{title}</h1>
        <h3> Note that the dependency data is not realtime, and some forms of dependencies may not be recognized.</h3>
      </hgroup>
      <div className={locals.contentContainer}>
        <DepList title="Depend by" path={path.join('/')} map={dependBy} filter={filter}/>
        <PathSelector title="Select a component" map={pathTree} path={path} setPath={setPath}/>
        <DepList title="Depend on" path={path.join('/')} map={dependOn} filter={filter}/>
      </div>
    </section>
  );
}
