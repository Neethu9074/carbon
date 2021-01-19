/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import { get } from 'lodash';

import ProfileNode from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileNode';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import keyCodes from 'in-components/keyCodes';

import nodeLocals from './ProfileNode.mless';
import locals from './ProfileTree.mless';

export default function ProfileNullChecker(props) {
  if (!props.profile) {
    return null;
  }
  return <ProfileTree {...props} />;
}

function ProfileTree({
  highlightedProfileConfig,
  profileEntityTechnology,
  canFetchSourceCode,
  entitySnapshot,
  threshold,
  profile
}) {
  const [selectedProfileNode, setSelectedProfileNode] = useState(null);

  return (
    <>
      {profile.profileGraph
        .filter(profileNode => profileNode.percent >= threshold)
        .map((profileNode, i) => (
          <div key={i} className={locals.profile}>
            <ProfileNode
              profileEntityTechnology={profileEntityTechnology}
              threshold={threshold}
              profileNode={profileNode}
              highlightedProfileConfig={highlightedProfileConfig}
              entitySnapshot={entitySnapshot}
              canFetchSourceCode={canFetchSourceCode}
              selectedProfileNode={selectedProfileNode}
              setSelectedProfileNode={setSelectedProfileNode}
              onKeyDown={onKeyDown}
            />
          </div>
        ))}
    </>
  );
}

// export for test
export function countSamples(profile) {
  let totalSamples = profile.numSamples || 0;

  const children = profile.children || [];
  for (let i = 0; i < children.length; i++) {
    totalSamples += countSamples(children[i]);
  }

  return totalSamples;
}

function onKeyDown(selectedNode, e) {
  if (
    e.keyCode !== keyCodes.arrows.up &&
    e.keyCode !== keyCodes.arrows.down &&
    e.keyCode !== keyCodes.arrows.left &&
    e.keyCode !== keyCodes.arrows.right
  ) {
    return;
  }

  stopPropagationAndPreventDefault(e);
  const focusedNode = Array.prototype.slice.call(document.querySelectorAll(`.${nodeLocals.focusedIcon}`))[0];
  if (!focusedNode) {
    return;
  }

  // when the current icon is a collapsed one, we want to expand it by simulating a click event on it
  if (e.keyCode === keyCodes.arrows.right) {
    if (get(focusedNode, ['attributes', 'aria-label', 'value']) === 'Expand') {
      return clickNod(focusedNode);
    }
  }

  // when the current icon is an expanded one, we want to collapse it by simulating a click event on it
  if (e.keyCode === keyCodes.arrows.left) {
    if (get(focusedNode, ['attributes', 'aria-label', 'value']) === 'Collapse') {
      return clickNod(focusedNode);
    }
  }

  const rows = [...Array.prototype.slice.call(document.querySelectorAll(`.${nodeLocals.expandIcon}`))];
  const selectedNodeIndex = rows.reduce((agg, row, i) => {
    if (row === focusedNode) {
      return i;
    }
    return agg;
  }, -1);

  const offset = e.keyCode === keyCodes.arrows.up || e.keyCode === keyCodes.arrows.left ? -1 : 1;
  const indexOfNewSelectedNode = selectedNodeIndex + offset;
  if (indexOfNewSelectedNode < 0 || indexOfNewSelectedNode >= rows.length) {
    return;
  }

  if (indexOfNewSelectedNode < rows.length) {
    const newSelectedRow = rows[indexOfNewSelectedNode];
    newSelectedRow.focus();
  }

  return;
}

function clickNod(node) {
  const clickEvent = document.createEvent('Events');
  clickEvent.initEvent('click', true, false);
  return node.dispatchEvent(clickEvent);
}
