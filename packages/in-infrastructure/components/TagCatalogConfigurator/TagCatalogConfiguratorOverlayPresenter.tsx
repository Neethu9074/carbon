/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, ListForm } from 'formalistic';
import React from 'react';

import { TagTreeNodeUnion } from '@instana/types';

// @ts-expect-error-error needs to be refactored
import DraggableItemSelector from 'in-components/DraggableItemSelector';
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { isBlank } from 'in-services/util/string';
import { noop } from 'in-services/util/function';
import { Col } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './TagCatalogConfiguratorOverlayPresenter.mless';

interface TagCatalogConfiguratorOverlayPresenterProps {
  readonly form: ListForm<Field<string>[]>;
  readonly onChange: unknown;
  readonly maximumNumberOfTags: number;
  readonly onAddItem: (item: string) => void;
  readonly onRemoveItem: unknown;
  readonly onSwap: unknown;
  readonly shouldTriggerWindowResize: unknown;
  readonly tagCatalog: EnrichedTagCatalog;
}

export default function TagCatalogConfiguratorOverlayPresenter({
  form,
  onChange,
  maximumNumberOfTags,
  onAddItem,
  onRemoveItem,
  onSwap,
  shouldTriggerWindowResize,
  tagCatalog
}: TagCatalogConfiguratorOverlayPresenterProps) {
  const tags = form.map(items =>
    items.map(field => {
      const tag = field.value;
      const label = tagCatalog?.tags?.find(t => t.name === tag)?.label;

      return {
        label,
        tag
      };
    })
  );

  return (
    <DraggableItemSelector
      onChange={onChange}
      items={form.map(items => items)}
      Content={Content}
      onSwap={onSwap}
      tags={tags}
      onRemove={onRemoveItem}
      shouldTriggerWindowResize={shouldTriggerWindowResize}
      disabled={form.size >= maximumNumberOfTags}
      // eslint-disable-next-line react/no-unused-prop-types
      SlideInContent={({ onShowSlideInContentChange }: { onShowSlideInContentChange: React.Dispatch<boolean> }) => (
        <TagSelectorOverlay
          tagCatalog={tagCatalog}
          onChange={node => {
            onAddItem(node.name);
            onShowSlideInContentChange(false);
          }}
          close={noop}
        />
      )}
      slideInContentTitle={t('in-infrastructure:tagConfigurator.titleAddATag')}
      tagCatalog={tagCatalog}
      className={locals.overlay}
    />
  );
}

function Content({
  index,
  item: tag,
  tagCatalog
}: {
  readonly index: number;
  readonly item: Field<string>;
  readonly tagCatalog: EnrichedTagCatalog;
}) {
  return (
    <Col xs={7}>
      <div className={locals.label}>
        <Label htmlFor={`tag-configuration-tag-${index}`}>
          <TagLabel tagCatalog={tagCatalog} tag={tag.value} />
        </Label>
      </div>
    </Col>
  );
}

function TagLabel({ tagCatalog, tag }: { readonly tagCatalog: EnrichedTagCatalog; readonly tag?: string }) {
  const path = tag && tagCatalog.tagsByName[tag]?.path;
  const label = LabelFromPath(path);
  return label ? (
    <Tooltip delay={500} content={label} align="rightMiddle">
      <span>{label}</span>
    </Tooltip>
  ) : (
    <Tooltip
      delay={500}
      content={
        <span>
          {tag === undefined || isBlank(tag) // empty tags can be boolean=true instead of blank string here somehow
            ? t('in-components:queryBuilder.components.unknownEmptyTagTooltip')
            : t('in-components:queryBuilder.components.unknownTagTooltip', { tagName: tag })}
        </span>
      }
    >
      <span>{t('in-components:queryBuilder.components.unknownTag')}</span>
    </Tooltip>
  );
}

function LabelFromPath(path: '' | undefined | TagTreeNodeUnion[]) {
  if (!path) return;
  return path
    .map(node => node.label)
    .filter(label => 'Others' !== label)
    .join(' / ');
}
