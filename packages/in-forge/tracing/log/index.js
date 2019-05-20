import genericLogSpanDefinition from 'in-forge/tracing/log/genericLogSpanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition(genericLogSpanDefinition);
