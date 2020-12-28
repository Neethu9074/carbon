import React, { Fragment, useRef, useState } from 'react';
import classNames from 'classnames';

import PercentIndicator from 'in-profiling/analyze/AnalyzeView/ProfilesView/PercentIndicator';
import FileNameAndLine from 'in-new-components/Profiling/components/FileNameAndLine';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import MethodName from 'in-new-components/Profiling/components/MethodName';
import At from 'in-new-components/Profiling/components/At';
import { treeViewExpanded } from 'in-profiling/tracker';
import { scrollIntoView } from 'in-services/util/dom';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ProfileNode.mless';

export default function ProfileNodeNullChecker(props) {
  if (!props.profileNode) {
    return null;
  }
  return <ProfileNode {...props} />;
}

function ProfileNode({
  highlightedProfileConfig,
  profileEntityTechnology,
  setSelectedProfileNode,
  selectedProfileNode,
  canFetchSourceCode,
  entitySnapshot,
  profileNode,
  depth = 0,
  threshold,
  onKeyDown
}) {
  const highlightedNodeDomRef = useRef(null);
  const [expanded, setExpanded] = useState(
    highlightedProfileConfig && highlightedProfileConfig.expandedIds.has(profileNode.__uid)
  );

  const isHighlighted = highlightedProfileConfig && highlightedProfileConfig.highlightedId === profileNode.__uid;
  if (highlightedNodeDomRef && highlightedNodeDomRef.current) {
    scrollIntoView(highlightedNodeDomRef.current, {
      behavior: 'smooth',
      block: 'center'
    });
  }
  const filteredChildren = profileNode.children.filter(childNode => childNode.percent >= threshold);
  const hasChildren = filteredChildren.length > 0;
  const isSelectedRow = selectedProfileNode === profileNode;

  return (
    <div onKeyDown={e => onKeyDown(selectedProfileNode, e)}>
      <Row
        depth={depth}
        isSelected={isSelectedRow}
        isHighlighted={isHighlighted}
        highlightedNodeDomRef={highlightedNodeDomRef}
      >
        <ExpandIcon
          isFocusedIcon={isSelectedRow}
          hasChildren={hasChildren}
          expanded={expanded}
          setExpanded={expand => {
            setExpanded(expand);
            if (expand) {
              treeViewExpanded(depth, profileEntityTechnology);
            }
          }}
          depth={depth}
          select={() => setSelectedProfileNode(profileNode)}
          unselect={() => setSelectedProfileNode(null)}
        />
        <PercentIndicator percent={profileNode.percent} />
        <MethodName methodName={profileNode.methodName} />
        <At />
        <FileNameAndLine
          canFetchSourceCode={canFetchSourceCode}
          entitySnapshot={entitySnapshot}
          profileNode={profileNode}
        />
      </Row>

      {expanded && hasChildren && (
        <div className={locals.childrenWrapper}>
          <ChildProfiles
            profileEntityTechnology={profileEntityTechnology}
            threshold={threshold}
            depth={depth}
            highlightedProfileConfig={highlightedProfileConfig}
            profiles={filteredChildren}
            entitySnapshot={entitySnapshot}
            canFetchSourceCode={canFetchSourceCode}
            selectedProfileNode={selectedProfileNode}
            setSelectedProfileNode={setSelectedProfileNode}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </div>
  );
}

function ChildProfiles({
  selectedProfileNode,
  highlightedProfileConfig,
  onKeyDown,
  setSelectedProfileNode,
  depth,
  profileEntityTechnology,
  profiles,
  entitySnapshot,
  threshold,
  runtime,
  canFetchSourceCode
}) {
  const lastProfile = profiles[profiles.length - 1];

  const nodeProps = {
    threshold,
    selectedProfileNode,
    highlightedProfileConfig,
    setSelectedProfileNode,
    onKeyDown,
    profileEntityTechnology,
    entitySnapshot,
    runtime,
    canFetchSourceCode,
    depth: depth + 1
  };

  if (profiles.length <= 1) {
    return <ProfileNode {...nodeProps} profileNode={lastProfile} autoExpand />;
  }

  const profilesWithoutLast = profiles.slice(0, profiles.length - 1);
  return (
    <>
      <div className={locals.children}>
        {profilesWithoutLast.map((childNode, i) => (
          <Fragment key={i}>
            {i < profiles.length - 1 && <div className={locals.verticalLine} />}
            <ProfileNode key={i} {...nodeProps} profileNode={childNode} />
          </Fragment>
        ))}
      </div>
      <ProfileNode {...nodeProps} profileNode={lastProfile} />
    </>
  );
}

function Row({ depth, isSelected, isHighlighted, highlightedNodeDomRef, children }) {
  return (
    <div
      ref={isHighlighted ? highlightedNodeDomRef : undefined}
      className={classNames({
        [locals.row]: true,
        [locals.expandedRow]: depth > 0,
        [locals.firstRow]: depth === 0,
        [locals.selectedRow]: isSelected,
        [locals.highlightedRow]: isHighlighted,
        [locals.nonHighlightedRow]: !isHighlighted
      })}
    >
      {children}
    </div>
  );
}

function ExpandIcon({ hasChildren, isFocusedIcon, expanded, setExpanded, select, unselect, depth }) {
  if (hasChildren) {
    return (
      <SvgIcon
        className={classNames({
          [locals.expandIcon]: true,
          [locals.focusedIcon]: isFocusedIcon
        })}
        type={expanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
        size="s"
        onClick={() => setExpanded(!expanded)}
        onBlur={unselect}
        onFocus={select}
        {...toInteractiveElement({
          ariaLabel: expanded ? 'Collapse' : 'Expand',
          onDefaultInteraction: () => setExpanded(!expanded)
        })}
      />
    );
  }
  return (
    <span
      className={classNames({
        [locals.iconPlaceHolder]: true,
        [locals.iconPlaceHolderWithLine]: depth > 0
      })}
    />
  );
}
