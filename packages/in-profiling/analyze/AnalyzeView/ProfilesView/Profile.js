import React, { useState, useEffect } from 'react';

import {
  cpuTreeViewOpened,
  cpuFlameGraphOpened,
  memoryTreeViewOpened,
  memoryFlameGraphOpened,
  waitTimeTreeViewOpened,
  waitTimeFlameGraphOpened
} from 'in-profiling/tracker';
import ProfileFlameGraph from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileFlameGraph';
import ResultForTimeSelectionIndicator from 'in-new-components/ResultForTimeSelectionIndicator';
import SettingsButton from 'in-profiling/analyze/AnalyzeView/ProfilesView/SettingsButton';
import { viewTypes } from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesView';
import countSamples from 'in-profiling/analyze/AnalyzeView/ProfilesView/sampleCount';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import ProfileTree from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileTree';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import { hasError, isLoading } from 'in-services/util/result';
import { formatTime } from 'in-services/formatters/date';
import { error } from 'in-new-components/Message/types';
import ButtonGroup from 'in-new-components/ButtonGroup';
import SearchInput from 'in-new-components/SearchInput';
import SetBodyColor from 'in-components/SetBodyColor';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Message from 'in-new-components/Message';
import Tooltip from 'in-components/Tooltip';

import locals from './Profile.mless';

export default function Profile({
  profile,
  viewType,
  threshold,
  processId,
  timeConfig,
  setViewType,
  renderChart,
  phpSnapshot,
  jvmSnapshot,
  isCpuProfile,
  setThreshold,
  isMemoryProfile,
  isWaitTimeProfile,
  canFetchSourceCode,
  highlightedTimeframe,
  profileForHighlightedTimeframeResult
}) {
  if (!profile) {
    return (
      <Message type={error} withIcon>
        There are no profiles in the selected timeframe.
      </Message>
    );
  }
  if (hasError(profileForHighlightedTimeframeResult)) {
    return (
      <Message type={error} withIcon>
        Error while loading profiles for the highlighted time: + profileForHighlightedTimeframeResult.errors[0]
      </Message>
    );
  }

  const { runtime } = profile;
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
    if (isCpuProfile && viewType === 'tree') cpuTreeViewOpened(runtime);
    if (isCpuProfile && viewType === 'flameGraph') cpuFlameGraphOpened(runtime);
    if (isWaitTimeProfile && viewType === 'tree') waitTimeTreeViewOpened(runtime);
    if (isWaitTimeProfile && viewType === 'flameGraph') waitTimeFlameGraphOpened(runtime);
    if (isMemoryProfile && viewType === 'tree') memoryTreeViewOpened(runtime);
    if (isMemoryProfile && viewType === 'flameGraph') memoryFlameGraphOpened(runtime);
  }, [viewType]);

  const isLoadingProfileForHighlightedTimeframe = isLoading(profileForHighlightedTimeframeResult);
  const profileForHighlightedTimeframeOrDefault = profileForHighlightedTimeframeResult?.data ?? profile;

  let totalNumSamples = 0;
  let profilesVisualisation;
  if (profileForHighlightedTimeframeOrDefault) {
    for (let i = 0; i < profileForHighlightedTimeframeOrDefault.profileGraph.length; i++) {
      totalNumSamples += countSamples(profileForHighlightedTimeframeOrDefault.profileGraph[i]);
    }

    profilesVisualisation =
      viewType === viewTypes.tree ? (
        <ProfileTree
          profile={profileForHighlightedTimeframeOrDefault}
          canFetchSourceCode={canFetchSourceCode}
          highlightedProfileConfig={highlightedProfileConfig}
          entitySnapshot={phpSnapshot || jvmSnapshot}
          threshold={threshold}
        />
      ) : (
        <ProfileFlameGraph
          profile={profileForHighlightedTimeframeOrDefault}
          query={query}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          selfTimeHighlighted={selfTimeHighlighted}
          setSelfTimeHighlighted={setSelfTimeHighlighted}
          threshold={threshold}
        />
      );
  }

  const numberOfProfiles =
    profileForHighlightedTimeframeOrDefault.numberOfProfiles ||
    profileForHighlightedTimeframeOrDefault.rawProfileTimestamps.length;

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

          <ProfilesIndicator
            isLoadingProfileForHighlightedTimeframe={isLoadingProfileForHighlightedTimeframe}
            profileForHighlightedTimeframeOrDefault={profileForHighlightedTimeframeOrDefault}
            numberOfProfiles={numberOfProfiles}
            totalNumSamples={totalNumSamples}
          />
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

      {/* the chart always takes the original profile */}
      {showGraph &&
        renderChart({ profileTimestamps: profile.rawProfileTimestamps, timeConfig, processId, jvmSnapshot })}

      {!isLoadingProfileForHighlightedTimeframe && profileForHighlightedTimeframeResult && (
        <ResultForTimeSelectionIndicator
          className={locals.timeselectionIndicator}
          entityName="profiles"
          message={
            !profileForHighlightedTimeframeResult.data
              ? `There are no profiles in the selected timeframe (${formatTime(highlightedTimeframe[0])} - ${formatTime(
                  highlightedTimeframe[1]
                )}). Showing all instead.`
              : `Showing profiles for selection (${formatTime(highlightedTimeframe[0])} - ${formatTime(
                  highlightedTimeframe[1]
                )})`
          }
        />
      )}
      {isLoadingProfileForHighlightedTimeframe ? (
        <HorizontalFlexWrapper className={locals.contentLoadingWrapper}>
          <LoadingIndicator width={150} height={150} text="Loading profiles" />
        </HorizontalFlexWrapper>
      ) : (
        profilesVisualisation
      )}
    </>
  );
}

function ProfilesIndicator({
  isLoadingProfileForHighlightedTimeframe,
  profileForHighlightedTimeframeOrDefault,
  numberOfProfiles,
  totalNumSamples
}) {
  if (isLoadingProfileForHighlightedTimeframe) {
    return <InfiniteCircle className={locals.infiniteCircle} width={72} height={24} />;
  }

  return (
    <>
      {profileForHighlightedTimeframeOrDefault && (
        <span className={locals.numProfilesLabel}>
          {numberOfProfiles} Profile
          {numberOfProfiles > 1 ? 's' : ''}
        </span>
      )}
      {totalNumSamples > 0 && totalNumSamples < 100 && (
        <Tooltip
          content={`Statistical confidence in percentage distribution is low, because not enough samples were collected (${totalNumSamples} samples) in the selected Timeframe.`}
          align="rightMiddle"
        >
          <SvgIcon className={locals.icon} type="lib_approximately_equal" />
        </Tooltip>
      )}
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
