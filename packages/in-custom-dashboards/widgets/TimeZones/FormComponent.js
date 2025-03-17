/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import React, { useMemo, useState, useEffect } from 'react';
import { CSS } from '@dnd-kit/utilities';

import { SvgIcon, Ul, Li, Stack, StackItem, Button, IconButton, Select } from '@instana/components';
import { getIntlDateFormatter } from '@instana/format-date';

// eslint-disable-next-line no-restricted-imports
import moment from 'in-services/moment-timezone';
import { createTimeZoneSubForm } from 'in-custom-dashboards/widgets/TimeZones/form';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import Header from 'in-components/workspace/Header';
import { compare } from 'in-services/util/number';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/TimeZones/FormComponent.mless';

export default function TimeZoneWidgetFormComponent({ form: timeZonesForm, onChange }) {
  const supportedTimeZones = useMemo(
    () =>
      moment.tz
        .names()
        .filter(isSupportedTimeZone)
        .map(name => {
          const timeZone = moment.tz(name);
          return {
            name,
            offset: timeZone._offset,
            humanReadableOffset: timeZone.format('Z')
          };
        })
        .sort((a, b) => {
          let result = compare(a.offset, b.offset);
          if (result === 0) {
            result = compareIgnoreCase(a.name, b.name);
          }
          return result;
        }),
    []
  );

  const [sortableTimeZones, setSortableTimeZones] = useState(timeZonesForm);

  useEffect(() => {
    setSortableTimeZones(timeZonesForm);
  }, [timeZonesForm]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const sortableTimeZonesIds = sortableTimeZones.map((timeZoneform, index) => ({
    id: `${index}`,
    timeZoneform
  }));

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.timezone.formComp.whatULikeShow')}</Header>
      <TouchedMessages field={timeZonesForm} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;

          const activeIndex = active.id;
          const overIndex = over.id;

          onChange([], form => {
            const timeZone = form.get(activeIndex);
            return form.remove(activeIndex).insert(overIndex, timeZone);
          });
        }}
      >
        <SortableContext items={sortableTimeZonesIds.map(item => item.id)} strategy={rectSortingStrategy}>
          <Stack gap="xsmall">
            {sortableTimeZonesIds.map(({ id, timeZoneform }, i) => (
              <SortableItem
                key={id}
                id={id}
                content={
                  <Ul>
                    <Li noAlternatingBg className={locals.timeZone}>
                      <HorizontalFlexWrapper className={locals.left}>
                        <Tooltip content={t('in-custom-dashboards:widgets.timezone.formComp.reorderTimeZones')}>
                          <div className={locals.dragHandle}>
                            <SvgIcon type="lib_menu" />
                          </div>
                        </Tooltip>
                        {timeZoneform.get('timeZone').map(field => (
                          <>
                            <label className={locals.label} htmlFor={`timeZones-widget-timeZone-${i}`}>
                              {t('in-custom-dashboards:widgets.timezone.formComp.timeZone')}
                            </label>
                            <Select
                              id={`timeZones-widget-timeZone-${i}`}
                              value={field.value}
                              onChange={e =>
                                onChange([i, 'timeZone'], field => field.setValue(e.target.value).setTouched(true))
                              }
                              hasError={!field.valid && field.touched}
                              className={locals.timeZoneSelection}
                              useFullWidth
                            >
                              {supportedTimeZones.map(({ name, humanReadableOffset }) => (
                                <option key={name} value={name}>
                                  {humanReadableOffset} – {name}
                                </option>
                              ))}
                            </Select>
                          </>
                        ))}
                        {timeZoneform.get('label').map(field => (
                          <Input
                            id={`timeZones-widget-label-${i}`}
                            type="text"
                            value={field.value}
                            placeholder={timeZoneform.get('timeZone').value ?? 'Label'}
                            onChange={e =>
                              onChange([i, 'label'], field => field.setValue(e.target.value).setTouched(true))
                            }
                            hasError={!field.valid && field.touched}
                            className={locals.timeZoneLabel}
                            maxLength={256}
                          />
                        ))}
                      </HorizontalFlexWrapper>
                      <HorizontalFlexWrapper className={locals.right}>
                        <IconButton
                          kind="primary"
                          aria-label={t('in-custom-dashboards:widgets.timezone.formComp.removeTimeZone')}
                          className={locals.removeButton}
                          type="lib_actions_delete"
                          onClick={() => onChange([], form => form.remove(i).setTouched(true))}
                        />
                      </HorizontalFlexWrapper>
                    </Li>
                  </Ul>
                }
              />
            ))}
            <StackItem>
              <Button
                kind="action"
                icon="lib_openclose_add"
                type="button"
                onClick={() => onChange([], form => form.push(createTimeZoneSubForm()).setTouched(true))}
                className={locals.addButton}
              >
                {t('in-custom-dashboards:widgets.timezone.formComp.addTimeZone')}
              </Button>
            </StackItem>
          </Stack>
        </SortableContext>
      </DndContext>
    </Stack>
  );
}

function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'relative',
    zIndex: isDragging ? 1000 : 'auto'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
}

function isSupportedTimeZone(timeZone) {
  try {
    getIntlDateFormatter({
      timeZone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    });
    return true;
  } catch (e) {
    return false;
  }
}
