import React, { useState } from 'react';

import ProfileNode from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileNode';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import ResultHeader from 'in-analyze/components/ResultHeader';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import keyCodes from 'in-components/keyCodes';
import Tooltip from 'in-components/Tooltip';

import locals from './Profile.mless';
import nodeLocals from './ProfileNode.mless';

export default function Profile({ profile, isOnline, processSnapshot }) {
  if (!profile) {
    return null;
  }

  let totalNumSamples = 0;
  for (let i = 0; i < profile.profileGraph.length; i++) {
    totalNumSamples += countSamples(profile.profileGraph[i]);
  }

  const [selectedProfileNode, setSelectedProfileNode] = useState(null);

  return (
    <>
      <div className={locals.header}>
        <ResultHeader
          withoutMargin
          itemType="Profile"
          nbRows={profile.profileGraph.length}
          nbItems={profile.profileGraph.length}
        />
        {totalNumSamples > 0 &&
          totalNumSamples < 100 && (
            <Tooltip
              content={`Statistical confidence in percentage distribution is low, because not enough samples where collected (${totalNumSamples} samples) in the selected Timeframe.`}
              align="rightMiddle"
            >
              <SvgIcon className={locals.icon} type="lib_approximately_equal" />
            </Tooltip>
          )}
      </div>
      {profile.profileGraph.map((profileNode, i) => (
        <div key={i} className={locals.profile}>
          <ProfileNode
            profileNode={profileNode}
            processSnapshot={processSnapshot}
            isOnline={isOnline}
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
  if (!selectedNode) {
    return;
  }

  const offset = e.keyCode === keyCodes.arrows.up || e.keyCode === keyCodes.arrows.left ? -1 : 1;
  const rows = [...Array.prototype.slice.call(document.querySelectorAll(`.${nodeLocals.expandIcon}`))];
  const focusedNode = Array.prototype.slice.call(document.querySelectorAll(`.${nodeLocals.focusedIcon}`))[0];

  const selectedNodeIndex = rows.reduce((agg, row, i) => {
    if (row === focusedNode) {
      return i;
    }
    return agg;
  }, -1);

  if (selectedNodeIndex === -1) {
    return;
  }

  const indexOfNewSelectedNode = selectedNodeIndex + offset;
  if (indexOfNewSelectedNode < rows.length) {
    const newSelectedRow = rows[indexOfNewSelectedNode];
    newSelectedRow.focus();
  }

  return;
}
