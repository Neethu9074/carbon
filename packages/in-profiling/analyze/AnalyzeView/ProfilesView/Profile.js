import React, { useState, useEffect } from 'react';

import {
  cpuTreeViewOpened,
  cpuFlameGraphOpened,
  waitTimeTreeViewOpened,
  waitTimeFlameGraphOpened
} from 'in-profiling/tracker';
import ProfileFlameGraph from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileFlameGraph';
import ResultForTimeSelectionIndicator from 'in-new-components/ResultForTimeSelectionIndicator';
import SettingsButton from 'in-profiling/analyze/AnalyzeView/ProfilesView/SettingsButton';
import { viewTypes } from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesView';
import ProfileChart from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileChart';
import countSamples from 'in-profiling/analyze/AnalyzeView/ProfilesView/sampleCount';
import ProfileTree from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileTree';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import ButtonGroup from 'in-new-components/ButtonGroup';
import SearchInput from 'in-new-components/SearchInput';
import SetBodyColor from 'in-components/SetBodyColor';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

import locals from './Profile.mless';

export default function Profile({
  renderChart,
  viewType,
  setViewType,
  profile,
  canFetchSourceCode,
  threshold,
  setThreshold,
  timeConfig,
  processId,
  jvmSnapshot,
  processSnapshot,
  isCpuProfile,
  isWaitTimeProfile,
  highlightedTimeframe
}) {
  const [showGraph, setShowGraph] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selfTimeHighlighted, setSelfTimeHighlighted] = useState(true);
  const [highlightedProfileConfig, setHighlightedProfileConfig] = useState(null);

  // the tree view auto expands if the highlighted id was set. This should only happen once and only on id change
  useEffect(() => {
    if (highlightedProfileConfig && highlightedProfileConfig.expandedIds.size > 0) {
      setHighlightedProfileConfig({
        ...highlightedProfileConfig,
        expandedIds: new Set()
      });
    } else {
      setHighlightedProfileConfig(null);
    }
  }, [highlightedProfileConfig]);

  useEffect(() => setQuery(''), [viewType]);
  useEffect(() => {
    if (isCpuProfile && viewType === 'tree') cpuTreeViewOpened();
    if (isCpuProfile && viewType === 'flameGraph') cpuFlameGraphOpened();
    if (isWaitTimeProfile && viewType === 'tree') waitTimeTreeViewOpened();
    if (isWaitTimeProfile && viewType === 'flameGraph') waitTimeFlameGraphOpened();
  }, [viewType]);

  let totalNumSamples = 0;
  let profilesVisualisation;
  if (profile) {
    for (let i = 0; i < profile.profileGraph.length; i++) {
      totalNumSamples += countSamples(profile.profileGraph[i]);
    }

    profilesVisualisation =
      viewType === viewTypes.tree ? (
        <ProfileTree
          profile={profile}
          processSnapshot={processSnapshot}
          canFetchSourceCode={canFetchSourceCode}
          highlightedProfileConfig={highlightedProfileConfig}
          threshold={threshold}
        />
      ) : (
        <ProfileFlameGraph
          profile={profile}
          query={query}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          selfTimeHighlighted={selfTimeHighlighted}
          setSelfTimeHighlighted={setSelfTimeHighlighted}
          threshold={threshold}
        />
      );
  }

  const numberOfProfiles = profile.numberOfProfiles || profile.rawProfileTimestamps.length;

  return (
    <>
      <SetBodyColor color="#fff" />
      <div className={locals.header}>
        <div className={locals.leftSide}>
          <ButtonGroup
            segmented
            buttonPropsList={[
              {
                text: 'Tree view',
                icon: 'lib_application_trace',
                key: viewTypes.tree,
                onClick: () => {
                  setViewType(viewTypes.tree);
                  if (selectedNode) {
                    setHighlightedProfileConfig({
                      highlightedId: selectedNode.__uid,
                      expandedIds: getPathIds(selectedNode.parentNode)
                    });
                  }
                }
              },
              {
                text: 'Flame graph',
                icon: 'lib_flame',
                key: viewTypes.flameGraph,
                onClick: () => setViewType(viewTypes.flameGraph)
              }
            ]}
            activeKey={viewType}
          />
          {renderChart && (
            <Button
              className={locals.graphButton}
              kind="secondary"
              icon="lib_views_stats"
              onClick={() => setShowGraph(!showGraph)}
            >
              {showGraph ? 'Hide ' : 'Show '} CPU graph
            </Button>
          )}
          {profile && (
            <span className={locals.numProfilesLabel}>
              {numberOfProfiles} Profile
              {numberOfProfiles > 1 ? 's' : ''}
            </span>
          )}
          {!profile && <span className={locals.numProfilesLabel}>0 Profiles</span>}
          {totalNumSamples > 0 && totalNumSamples < 100 && (
            <Tooltip
              content={`Statistical confidence in percentage distribution is low, because not enough samples were collected (${totalNumSamples} samples) in the selected Timeframe.`}
              align="rightMiddle"
            >
              <SvgIcon className={locals.icon} type="lib_approximately_equal" />
            </Tooltip>
          )}
        </div>

        <HorizontalFlexWrapper>
          <SettingsButton
            threshold={threshold}
            setThreshold={v => {
              setThreshold(v);
              setSelectedNode(null);
            }}
            showGraph={showGraph}
            setShowGraph={setShowGraph}
            selfTimeHighlighted={selfTimeHighlighted}
            setSelfTimeHighlighted={setSelfTimeHighlighted}
          />
          {viewType === viewTypes.flameGraph && (
            <SearchInput className={locals.searchInput} onChange={setQuery} query={query} autoFocus maxWidth={200} />
          )}
        </HorizontalFlexWrapper>
      </div>
      {showGraph && renderChart && (
        <ProfileChart profile={profile} timeConfig={timeConfig} processId={processId} jvmSnapshot={jvmSnapshot} />
      )}
      {(highlightedTimeframe || profile.__missingProfileFlag) && (
        <ResultForTimeSelectionIndicator
          className={locals.timeselectionIndicator}
          entityName="profiles"
          message={
            profile.__missingProfileFlag ?? 'The are no profiles in the selected timeframe. Showing all instead.'
          }
        />
      )}
      {profilesVisualisation}
    </>
  );
}

function getPathIds(node) {
  const ids = [];
  collectIds(node, ids);
  return new Set(ids);
}

function collectIds(node, ids) {
  if (!node) {
    return;
  }
  ids.push(node.__uid);
  collectIds(node.parentNode, ids);
}
