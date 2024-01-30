import {atom, action} from 'nanostores';
import stringWidth from 'string-width';

export const $newLines = atom(0);
export const $definitionHeight = atom(2);
export const $panelHeight = atom(process.stdout.rows - 4);

export const actions = {
	setNewLines: action($newLines, 'setNewLine', (store, value) => {
		store.set(value);

		return store.get();
	}),
	increment: action($newLines, 'increment', store => {
		store.set(store.get() + 1);

		return store.get();
	}),
	decrement: action($newLines, 'decrement', store => {
		store.set(store.get() - 1);
		return store.get();
	}),
	calculateDefinitionHeight: action(
		$definitionHeight,
		'calculateDefinitionHeight',
		(store, definition) => {
			const {columns} = process.stdout;

			let definitionRowsCount = 1;
			const calculatedWidth = stringWidth(definition);
			if (calculatedWidth > columns) {
				let counter = 0;
				let remained = calculatedWidth;

				while (counter < remained) {
					remained -= columns;
					counter += 1;
				}

				definitionRowsCount = counter;
			}

			store.set(definitionRowsCount);
			return store.get();
		},
	),
	setDefinitionHeight: action(
		$definitionHeight,
		'setDefinitionHeight',
		(store, value) => {
			store.set(value);
			return store.get();
		},
	),
	setPanelHeight: action($panelHeight, 'setPanelHeight', (store, value) => {
		store.set(value);
		return store.get();
	}),
};

export const manager = {};
