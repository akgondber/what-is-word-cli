import React from 'react';
import chalk from 'chalk';
import test from 'ava';
import {render} from 'ink-testing-library';
import * as R from 'remeda';
import App from './source/app.js';

test('App is a function', t => {
	t.true(R.isFunction(App));
});

test('renders description page', t => {
	const {lastFrame} = render(<App />);
	const result = lastFrame();
	t.true(
		result.includes(
			'Try to unscramble words by given definition and provide a correct',
		),
	);
	t.true(result.includes(chalk.cyan('y')));
});
