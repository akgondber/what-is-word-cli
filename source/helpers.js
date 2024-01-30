import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {fdir} from 'fdir';
import * as R from 'remeda';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const revertValue = (item, key) => R.set(item, key, !item[key]);
const getId = () => {
	return R.randomString(15);
};

const getRandomItem = source => R.first(R.shuffle(source));

const loadJsonFile = filename =>
	fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename)) : undefined;

const getRandomSuite = () => {
	const sourcesPath = path.join(__dirname, 'suites');
	const files = new fdir()
		.filter((path, _isDirectory) => path.endsWith('.json'))
		.withFullPaths()
		.crawl(sourcesPath)
		.sync();

	return loadJsonFile(getRandomItem(files));
};

const getRandomCategorizedSuite = () => {
	const sourcesPath = path.join(__dirname, 'suites', 'categorized');
	const files = new fdir()
		.filter((path, _isDirectory) => path.endsWith('.json'))
		.withFullPaths()
		.crawl(sourcesPath)
		.sync();

	return loadJsonFile(getRandomItem(files));
};

const getCategorizedSuite = name => {
	const filename = path.join(
		__dirname,
		'suites',
		'categorized',
		`${name}.json`,
	);
	return loadJsonFile(filename);
};

const getRandomSuiteByTopic = topic => {
	const sourcesPath = path.join(__dirname, 'suites', topic);
	const files = new fdir()
		.filter((path, _isDirectory) => path.endsWith('.json'))
		.withFullPaths()
		.crawl(sourcesPath)
		.sync();
	return loadJsonFile(getRandomItem(files));
};

const getRandomSuiteByTopicAndSubtopic = (topic, subtopic) => {
	const sourcesPath = path.join(__dirname, 'suites', topic, subtopic);

	const files = new fdir()
		.filter((path, _isDirectory) => path.endsWith('.json'))
		.withFullPaths()
		.crawl(sourcesPath)
		.sync();
	return loadJsonFile(getRandomItem(files));
};

const getSuiteByTopicAndName = (topic, name) => {
	const sourcesPath = path.join(__dirname, 'suites', topic);
	const files = new fdir()
		.filter((path, _isDirectory) => path.endsWith(`${name}.json`))
		.withFullPaths()
		.crawl(sourcesPath)
		.sync();
	return loadJsonFile(R.first(files));
};

const getSuiteByTopicSubtopicAndName = (topic, subtopic, name) => {
	const filename = path.join(
		__dirname,
		'suites',
		topic,
		subtopic,
		`${name}.json`,
	);

	return loadJsonFile(filename);
};

const getSuiteBySettings = settings => {
	let suite;
	if (R.isDefined(settings.category)) {
		suite = getCategorizedSuite(settings.category);
	} else if (
		R.isDefined(settings.topic) &&
		R.isDefined(settings.subTopic) &&
		R.isDefined(settings.name)
	) {
		suite = getSuiteByTopicSubtopicAndName(
			settings.topic,
			settings.subTopic,
			settings.name,
		);
	} else if (R.isDefined(settings.topic) && R.isDefined(settings.subTopic)) {
		suite = getRandomSuiteByTopicAndSubtopic(settings.topic, settings.subTopic);
	} else if (R.isDefined(settings.topic) && R.isDefined(settings.name)) {
		suite = getSuiteByTopicAndName(settings.topic, settings.name);
	} else if (R.isDefined(settings.topic)) {
		suite = getRandomSuiteByTopic(settings.topic);
	}

	return R.isEmpty(suite) ? getRandomSuite() : suite;
};

const isFound = index => !R.equals(index, -1);

export {
	revertValue,
	getId,
	getRandomSuite,
	getRandomItem,
	getRandomSuiteByTopic,
	getRandomSuiteByTopicAndSubtopic,
	getSuiteByTopicAndName,
	getSuiteBySettings,
	getRandomCategorizedSuite,
	isFound,
};
