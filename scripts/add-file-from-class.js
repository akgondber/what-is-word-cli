import enquirer from 'enquirer';
import editJsonFile from 'edit-json-file';
import * as R from 'remeda';

const {prompt, List} = enquirer;

const items = [];

const {file} = await prompt({
	type: 'input',
	name: 'file',
	message: 'Filename',
});

const {jsFile} = await prompt({
	type: 'input',
	name: 'jsFile',
	message: 'JS filename',
});

const {default: Suite} = await import(`file://${jsFile}`);
const suite = new Suite().build();

R.map(suite, ({word, definition}) => {
	items.push({
		word,
		definition:
			R.first(definition).toUpperCase() + R.sliceString(1)(definition),
	});
});

const tagsResponse = new List({
	name: 'tags',
	message: 'Comma separated tag names',
});
const dest = editJsonFile(
	`C:\\fep\\bckn\\cudi\\v2\\what-is-word-cli\\source\\suites\\categorized\\${file}`,
);

const tags = await tagsResponse.run();
dest.set('items', items);
dest.set('tags', tags);
dest.save();
