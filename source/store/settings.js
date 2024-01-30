import {action, map} from 'nanostores';

export const $settings = map({
	topic: undefined,
	subTopic: undefined,
	name: undefined,
});

export const actions = {
	setTopic: action($settings, 'setTopic', (store, topic) => {
		store.setKey(topic, topic);
		return store.get();
	}),
	setSubTopic: action($settings, 'setSubTopic', (store, subTopic) => {
		store.setKey('subTopic', subTopic);
		return store.get();
	}),
	setSettings: action($settings, 'setSettings', (store, settings) => {
		store.set(settings);
		return store.get();
	}),
	clear: action($settings, 'clear', store => {
		store.set({
			topic: undefined,
			subTopic: undefined,
			name: undefined,
		});
		return store.get();
	}),
};
