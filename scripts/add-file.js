import enquirer from 'enquirer';
import editJsonFile from 'edit-json-file';
import * as R from 'remeda';

const {prompt, List} = enquirer;

let i = 0;
const items = [];
const {file} = await prompt({
	type: 'input',
	name: 'file',
	message: 'Filename',
});

while (i < 100) {
	/* eslint-disable no-await-in-loop */
	let response = await prompt({
		type: 'input',
		name: 'word',
		message: 'What is a source word?',
	});

	if (response.word === '_') {
		break;
	}

	const {word} = response;

	response = await prompt({
		type: 'input',
		name: 'definition',
		message: 'What is a defintion?',
	});
	/* eslint-enable no-await-in-loop */

	items.push({
		word,
		definition:
			R.first(response.definition).toUpperCase() +
			R.sliceString(1)(response.definition),
	});
	i++;
	if (i > 100) break;
}

const tagsResponse = new List({
	name: 'tags',
	message: 'Comma separated tag names',
});
const dest = editJsonFile(file);

const tags = await tagsResponse.run();
dest.set('items', items);
dest.set('tags', tags);
dest.save();
