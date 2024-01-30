#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import * as R from 'remeda';
import App from './app.js';

const cli = meow(
	`
		Usage
		  $ what-is-word-cli

		Options
			--category Category to be used in the game's round
			--topic Topic to be used in the game's round (some categories have topics others don't have)
			--subtopic Subtopic to be used (when using the topic option)
			--name The name for a category (for a topic)

		Examples
		  $ what-is-word-cli
		  $ what-is-word-cli --category fruits
		  $ what-is-word-cli -c fruits
		  $ what-is-word-cli --category words
		  $ what-is-word-cli --topic literature
		  $ what-is-word-cli --topic literature --subtopic mark-twain
		  $ what-is-word-cli --topic literature --subtopic mark-twain --name is-he-living-or-is-he-dead
		  $ what-is-word-cli -t literature -s mark-twain -n is-he-living-or-is-he-dead
	`,
	{
		importMeta: import.meta,
		flags: {
			category: {
				type: 'string',
				shortFlag: 'c',
			},
			topic: {
				type: 'string',
				shortFlag: 't',
			},
			subtopic: {
				type: 'string',
				shortFlag: 's',
			},
			name: {
				type: 'string',
				shortFlag: 'n',
			},
		},
	},
);

const settings = R.pickBy(
	{
		category: cli.flags.category,
		topic: cli.flags.topic,
		subTopic: cli.flags.subtopic,
		name: cli.flags.name,
	},
	R.isDefined,
);

if (process.stdout.rows < 19) {
	console.log(
		'Height of terminal is not acceptable to this game. Please resize the screen and run again.',
	);
} else {
	console.clear();
	const {waitUntilExit} = render(<App settings={settings} />);
	await waitUntilExit();
	console.clear();
}
