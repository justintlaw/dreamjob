import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Dreamjob from '../lib/dreamjob-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Dreamjob.DreamjobStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
