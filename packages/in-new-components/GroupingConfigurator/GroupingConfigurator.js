import React, { useRef } from 'react';
import rpt from 'prop-types';

import ActiveGroupingConfiguration from 'in-new-components/GroupingConfigurator/ActiveGroupingConfiguration';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';
import LoadingIndicator from 'in-new-components/GroupingConfigurator/LoadingIndicator';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import Overlay from 'in-new-components/overlays/Overlay';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Button from 'in-new-components/Button';

import locals from './GroupingConfigurator.mless';

export default function GroupingConfigurator({
  value: group,
  tagFilterExpression,
  getTagCatalog,
  getSuggestions,
  onChange,
  tracking,
  label = 'Add group',
  loadingLabel
}) {
  const timeConfig = useTimeConfig();
  const tagCatalog = useObservable(getTagCatalogObservable, [getTagCatalog, timeConfig]);
  const autoFocus = useRef();

  if (!tagCatalog?.data) {
    return <LoadingIndicator text={loadingLabel} />;
  }

  return (
    <>
      <Overlay
        content={TagSelectorOverlay}
        props={{
          tagCatalog: tagCatalog.data,
          onChange: ({ name }) => {
            autoFocus.current = Date.now();
            const selectedGroup = setEntityIfNecessary(name);
            tracking?.onGroupAdded?.(selectedGroup);
            onChange(selectedGroup);
          }
        }}
        align={'bottomLeft'}
        withoutWrapper
      >
        {({ toggle, refSetter }) =>
          group?.groupbyTag ? (
            <ActiveGroupingConfiguration
              onChange={onChange}
              onGroupRemoved={tracking?.onGroupRemoved}
              getSuggestions={getSuggestions}
              group={group}
              toggle={toggle}
              ref={refSetter}
              tagCatalog={tagCatalog.data}
              tagFilterExpression={tagFilterExpression}
              autoFocus={autoFocus.current}
            />
          ) : (
            <Button
              className={locals.noActiveGroupingButton}
              kind={'subtle'}
              size="compact"
              icon={'lib_openclose_add'}
              refSetter={refSetter}
              onClick={toggle}
            >
              {label}
            </Button>
          )
        }
      </Overlay>
    </>
  );

  function setEntityIfNecessary(groupbyTag) {
    const tagTreeNode = tagCatalog.data.tagsByName[groupbyTag];
    if (tagTreeNode.canApplyToSource && tagTreeNode.canApplyToDestination) {
      return {
        groupbyTag,
        groupbyTagEntity: DESTINATION
      };
    }

    return { groupbyTag };
  }
}

export const trackingProps = {
  onGroupAdded: rpt.func,
  onGroupRemoved: rpt.func
};

GroupingConfigurator.propTypes = {
  onChange: rpt.func.isRequired,
  value: rpt.object,
  getTagCatalog: rpt.func.isRequired,
  getSuggestions: rpt.func.isRequired,
  tagFilterExpression: rpt.object.isRequired,
  tracking: rpt.shape(trackingProps),
  label: rpt.string,
  loadingLabel: rpt.string
};

function getTagCatalogObservable([getTagCatalog, timeConfig]) {
  return getTagCatalog({ timeConfig });
}
