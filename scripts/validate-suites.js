import fs from 'node:fs';
import {create, test, each, enforce} from 'vest';
import * as R from 'remeda';
import enquirer from 'enquirer';

const {prompt} = enquirer;

const response = await prompt({
	type: 'input',
	name: 'file',
	message: 'What is filename you want to validate?',
});

const {file} = response;
if (!fs.existsSync(file)) {
	throw new Error(
		`File ${file} does not exist. Please check that there is no any typos.`,
	);
}

const suite = create((data = {}) => {
	each(data.items, field => {
		test(
			'word',
			'word value must contain greater than 2 chars',
			() => {
				enforce(field.word).isNotBlank().longerThan(2);
			},
			field.word,
		);
		test(
			'definition',
			'definition value must contain greater than 5 chars',
			() => {
				enforce(field.definition).isNotBlank().longerThan(5);
			},
			field.definition,
		);
	});
});

const content = JSON.parse(fs.readFileSync(file, 'utf8'));
const {items} = content;
const uniqueItems = R.uniqWith(items, R.equals);
const lengthP = R.prop('length');

if (lengthP(items) > lengthP(uniqueItems)) {
	throw new Error('There are duplicate items found in the file.');
}

const validationResult = suite(content);

if (validationResult.isValid()) {
	console.log('The file conforms a validation schema.');
} else {
	console.log('The file have some problems.');
	console.log('Errors:');
	console.log(validationResult.errors);
}
