/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useMemo } from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import { createTimeZoneSubForm } from 'in-custom-dashboards/widgets/TimeZones/form';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import { compareIgnoreCase } from 'in-services/util/string';
import { Ul, Li } from 'in-new-components/lists/List/List';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';
import { compare } from 'in-services/util/number';
import moment from 'in-services/moment-timezone';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './FormComponent.mless';

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

  return (
    <Stack space="normal">
      <Header>{t('in-custom-dashboards:widgets.timezone.formComp.whatULikeShow')}</Header>
      <TouchedMessages field={timeZonesForm} />

      <DragDropContext
        onDragEnd={e => {
          if (e.destination) {
            onChange([], form => {
              const timeZone = form.get(e.source.index);
              return form.remove(e.source.index).insert(e.destination.index, timeZone);
            });
          }
        }}
      >
        <Droppable droppableId="timeZones-widget-configuration">
          {provided => (
            <Stack space="xsmall" ref={provided.innerRef}>
              {timeZonesForm.map((timeZoneform, i) => (
                <Draggable key={i} draggableId={String(i)} index={i}>
                  {provided => (
                    <Ul ref={provided.innerRef} {...provided.draggableProps}>
                      <Li noAlternatingBg className={locals.timeZone}>
                        <HorizontalFlexWrapper className={locals.left}>
                          <Tooltip content={t('in-custom-dashboards:widgets.timezone.formComp.reorderTimeZones')}>
                            <div className={locals.dragHandle} {...provided.dragHandleProps}>
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
                          <SvgIcon
                            ariaLabel={t('in-custom-dashboards:widgets.timezone.formComp.removeTimeZone')}
                            className={locals.removeButton}
                            type="lib_actions_delete"
                            onClick={() => onChange([], form => form.remove(i).setTouched(true))}
                          />
                        </HorizontalFlexWrapper>
                      </Li>
                    </Ul>
                  )}
                </Draggable>
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

              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
}

function isSupportedTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat('de-de', {
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
