import fs from 'node:fs';
import {atom, deepMap, action} from 'nanostores';
import * as R from 'remeda';
import {getRandomItem, isFound, revertValue} from './helpers.js';
import {$gameRounds, manager as gameManager} from './store/game.js';

export const $roundItem = deepMap({
	word: '',
	shuffledWord: '',
	definition: '',
	template: [[]],
	intervalId: null,
	status: 'running',
});

export const $suite = atom([]);

const getPattern = word => {
	const first = [];
	const second = [];
	for (const char of word) {
		const randomBoolean = Math.random() > 0.49;
		first.push(randomBoolean ? ' ' : char);
		second.push(randomBoolean ? char : ' ');
	}

	return [first, second];
};

export const manager = {
	setRoundTemplate: action($roundItem, 'setRoundTemplate', store => {
		store.setKey('template', getPattern(store.get().shuffledWord));
		return store.get();
	}),
	setRoundWord: action($roundItem, 'setRoundWord', (store, newWord) => {
		store.setKey('word', newWord);
		return store.get();
	}),
	setSuite: action($suite, 'setSuite', (store, newSuite) => {
		store.set(newSuite);
		return store.get();
	}),
	startAgain: action($gameRounds, 'startAgain', store => {
		store.set([]);
		return store.get();
	}),
	clearGameRounds: action($gameRounds, 'clearGameRounds', store => {
		store.set([]);
		return store.get();
	}),
	setupNextRound: action($roundItem, 'setupNextRound', store => {
		const remainedItems = R.differenceWith(
			$suite.get(),
			$gameRounds.get(),
			(a, b) => {
				return (
					R.pathOr(a, ['word'], 'a') === R.pathOr(b, ['item', 'word'], 'b')
				);
			},
		);
		if (remainedItems.length > 0) {
			let newItem = getRandomItem(remainedItems);
			const shuffledWord = R.pipe(
				newItem,
				R.prop('word'),
				v => [...v],
				R.shuffle,
				R.join(''),
			);
			newItem = R.merge(newItem, {
				shuffledWord,
				template: getPattern(shuffledWord),
			});
			store.set(newItem);
			gameManager.addRoundItem(newItem);
		}

		return store.get();
	}),
	setIntervalId: action($roundItem, 'setIntervalId', (store, intervalId) => {
		store.setKey('intervalId', intervalId);
		return store.get();
	}),
	displayNextResult: action($gameRounds, 'displayNextResult', async store => {
		const gameRounds = store.get();
		const currentDisplayingIndex = R.findIndex(gameRounds, item =>
			R.equals(item.isDisplaying, true),
		);
		if (isFound(currentDisplayingIndex)) {
			const nextIndex = R.findIndex.indexed(
				gameRounds,
				(item, i) => i > currentDisplayingIndex && !item.isDisplaying,
			);

			if (isFound(nextIndex)) {
				if (gameRounds[nextIndex]) {
					store.set(
						R.map.indexed(gameRounds, (item, i) =>
							[nextIndex, currentDisplayingIndex].includes(i)
								? revertValue(item, 'isDisplaying')
								: item,
						),
					);
				}

				return store.get();
			}
		} else {
			const indexToDisplay = R.findIndex(gameRounds, item =>
				R.equals(item.isDisplaying, false),
			);
			if (isFound(indexToDisplay)) {
				store.set(
					R.map.indexed(gameRounds, (item, i) =>
						i === indexToDisplay ? R.set(item, 'isDisplaying', true) : item,
					),
				);
			}
		}

		return store.get();
	}),
	displayPreviousResult: action(
		$gameRounds,
		'displayPreviousResult',
		async store => {
			const gameRounds = store.get();
			const currentDisplayingIndex = R.findIndex(gameRounds, item =>
				R.equals(item.isDisplaying, true),
			);

			if (isFound(currentDisplayingIndex)) {
				const previousIndex = R.findLastIndex.indexed(
					gameRounds,
					(item, i) => i < currentDisplayingIndex && !item.isDisplaying,
				);

				if (isFound(previousIndex)) {
					if (gameRounds[previousIndex]) {
						fs.appendFileSync(
							'C:\\fep\\bckn\\_ew.txt',
							`PrevInd: ${previousIndex}; curr: ${currentDisplayingIndex}\n`,
						);
						store.set(
							R.map.indexed(gameRounds, (item, i) =>
								[previousIndex, currentDisplayingIndex].includes(i)
									? revertValue(item, 'isDisplaying')
									: item,
							),
						);
					}

					return store.get();
				}
			} else {
				const indexToDisplay = R.findIndex(gameRounds, item =>
					R.equals(item.isDisplaying, false),
				);
				if (isFound(indexToDisplay)) {
					store.set(
						R.map.indexed(gameRounds, (item, i) =>
							i === indexToDisplay ? R.set(item, 'isDisplaying', true) : item,
						),
					);
				}
			}

			return store.get();
		},
	),
};
