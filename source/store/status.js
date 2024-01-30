import {atom, action} from 'nanostores';
import * as R from 'remeda';

export const statuses = {
	waiting: 'WAITING',
	running: 'RUNNING',
	paused: 'PAUSED',
	finished: 'FINISHED',
	displayingInfo: 'DISPLAYING_INFO',
	displayingResult: 'DISPLAYING_RESULT',
	displayingResults: 'DISPLAYING_RESULTS',
};

export const $status = atom(statuses.paused);

export const actions = {
	setRunning: action($status, 'setRunning', store => {
		store.set(statuses.running);
		return store.get();
	}),
	setFinished: action($status, 'setFinished', store => {
		store.set(statuses.finished);
		return store.get();
	}),
	setPaused: action($status, 'setPaused', store => {
		store.set(statuses.paused);
		return store.get();
	}),
	setDisplayingInfo: action($status, 'setDisplayingInfo', store => {
		store.set(statuses.displayingInfo);
		return store.get();
	}),
	setDisplayingResult: action($status, 'setDisplayingResult', store => {
		store.set(statuses.displayingResult);
		return store.get();
	}),
};

const equalsX = value => R.equals($status.get(), value);

export const manager = {
	isFinished() {
		return equalsX(statuses.finished);
	},
	isRunning() {
		return equalsX(statuses.running);
	},
	isPaused: () => equalsX(statuses.paused),
	isDisplayingInfo: () => equalsX(statuses.displayingInfo),
	isDisplayingResult: () => equalsX(statuses.displayingResult),
};
