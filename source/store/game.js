import {atom, action, computed} from 'nanostores';
import * as R from 'remeda';
import {isFound} from '../helpers.js';

export const $gameRounds = atom([]);
export const $score = atom(0);
export const $userInput = atom('');
export const $itemToDisplay = computed($gameRounds, gameRounds => {
	const gameRound = R.find(gameRounds, item => item.isDisplaying);

	if (gameRound) {
		const {item} = gameRound;
		return {
			item,
			isCorrect: item.status === 'success',
		};
	}
});

export const $runningItem = computed($gameRounds, gameRounds => {
	const gameRound = R.find(gameRounds, item => item.isRunning);

	if (gameRound) {
		return gameRound.item;
	}
});

export const $lastUserAnswer = computed($gameRounds, gameRounds => {
	const gameRound = R.find(gameRounds, item => item.isRunning);

	if (gameRound) {
		return gameRound.userAnswer;
	}
});

const mergeOptionsOfRunningItem = (source, newOptions) => {
	const activeItemIndex = R.findIndex(source, current => current.isRunning);

	if (isFound(activeItemIndex)) {
		return R.splice(source, activeItemIndex, 1, [
			R.merge(source[activeItemIndex], newOptions),
		]);
	}

	return source;
};

export const manager = {
	addRoundItem: action($gameRounds, 'addRoundItem', (store, item) => {
		store.set([
			...store.get(),
			{item, status: 'waiting', isRunning: true, isDisplaying: false},
		]);
		return store.get();
	}),
	setSucceeded: action($gameRounds, 'setSucceeded', (store, userAnswer) => {
		const previous = store.get();
		store.set(
			mergeOptionsOfRunningItem(previous, {
				status: 'success',
				isRunning: false,
				message: 'Success!',
				userAnswer,
			}),
		);
		return store.get();
	}),
	registerUserAnswer: action(
		$gameRounds,
		'registerUserAnswer',
		(store, userAnswer) => {
			const previous = store.get();
			store.set(mergeOptionsOfRunningItem(previous, {userAnswer}));
			return store.get();
		},
	),
	setErrored: action($gameRounds, 'setErrored', store => {
		const previous = store.get();
		store.set(
			mergeOptionsOfRunningItem(previous, {
				status: 'error',
				isRunning: false,
				message: 'Failure',
			}),
		);
		return store.get();
	}),
	setInput: action($userInput, 'setInput', (store, value) => {
		store.set(value);
		return store.get();
	}),
	resetInput: action($userInput, 'setInput', store => {
		store.set('');
		return store.get();
	}),
	appendChar: action($userInput, 'appendChar', (store, value) => {
		store.set(value);
		return store.get();
	}),
};

export const scoreActions = {
	increment: action($score, 'increment', store => {
		store.set(store.get() + 1);
		return store.get();
	}),
	reset: action($score, 'reset', store => {
		store.set(0);
		return store.get();
	}),
};
