/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { eventBus } from 'in-map/services/eventBus';

export default function onPressed() {
  if (eventBus) {
    eventBus.emit('enterFullscreen', true);
  }
}
