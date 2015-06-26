'use strict';

export const plugins = {
  ec2: 'com.instana.forge.infrastructure.virtualization.EC2',
  os: 'com.instana.forge.infrastructure.os.OS',
  process: 'com.instana.forge.infrastructure.os.Process'
};

export const rels = {
  describes: 'com.instana.sdk.annotation.Describes:reverse'
};
