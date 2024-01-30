import React, {useState, createContext, useMemo} from 'react';
import {useInput} from 'ink';
import {useStore} from '@nanostores/react';
import {manager as appManager} from './store.js';
import {
	$status,
	actions as statusActions,
	manager as statusManager,
} from './store/status.js';
import {actions as settingsActions} from './store/settings.js';
import Game from './components/Game.js';
import Results from './components/Results.js';

export const SettingsContext = createContext({});

export default function App({settings: userSettings}) {
	const [settings, setSettings] = useState(userSettings);
	const settingsValue = useMemo(() => ({settings, setSettings}), [settings]);
	useStore($status);

	useInput((input, _key) => {
		if (statusManager.isFinished() && input === 'b') {
			appManager.clearGameRounds();

			settingsActions.clear();
			statusActions.setRunning();
		}
	});

	return (
		<SettingsContext.Provider value={settingsValue}>
			{statusManager.isFinished() ? <Results /> : <Game />}
		</SettingsContext.Provider>
	);
}
