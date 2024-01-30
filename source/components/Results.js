import React, {useContext} from 'react';
import {Text, Box, useApp, useInput} from 'ink';
import {StatusMessage} from '@inkjs/ui';
import figureSet from 'figures';
import * as R from 'remeda';
import {useStore} from '@nanostores/react';
import {manager as appManager} from '../store.js';
import {
	$status,
	actions as statusActions,
	manager as statusManager,
} from '../store/status.js';
import {$settings, actions as settingsActions} from '../store/settings.js';
import {$gameRounds, $score, scoreActions} from '../store/game.js';
import {SettingsContext} from '../app.js';

export default function Results() {
	const gameRounds = useStore($gameRounds);
	useStore($status);
	const score = useStore($score);
	useStore($settings);
	const itemToDisplay = R.find(gameRounds, item => item.isDisplaying);
	const {setSettings} = useContext(SettingsContext);
	const {exit} = useApp();

	useInput((input, key) => {
		if (statusManager.isFinished()) {
			if (key.rightArrow) {
				appManager.displayNextResult();
			} else if (key.leftArrow) {
				appManager.displayPreviousResult();
			} else
				switch (input) {
					case 'n': {
						appManager.clearGameRounds();
						settingsActions.clear();
						scoreActions.reset();
						setSettings({});
						// SetSettings({topic: 'literature'});
						statusActions.setPaused();

						break;
					}

					case 's': {
						appManager.clearGameRounds();
						scoreActions.reset();
						statusActions.setPaused();

						break;
					}

					case 'q': {
						exit();

						break;
					}
					// No default
				}
		}
	});

	return (
		<Box
			width={process.stdout.columns}
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			marginLeft={1}
		>
			<Box justifyContent="flex-start" marginBottom={2} borderStyle="single">
				<Text>
					Score: {score} out of {gameRounds.length}
				</Text>
			</Box>
			<Box
				flexDirection="column"
				alignItems="center"
				marginLeft={2}
				marginRight={1}
				marginBottom={2}
			>
				<Box>
					{itemToDisplay && (
						<Box flexDirection="column">
							<Box marginLeft={1}>
								<Text color="#e69a8d">{itemToDisplay.item.definition}</Text>
							</Box>
							<Box marginLeft={3} paddingLeft={2}>
								{itemToDisplay.userAnswer === itemToDisplay.item.word ? (
									<StatusMessage variant="success">
										{itemToDisplay.item.word}
									</StatusMessage>
								) : (
									<Box flexDirection="column">
										<StatusMessage variant="error">
											{R.pathOr(itemToDisplay, ['userAnswer'], '-')}
										</StatusMessage>
										<StatusMessage variant="success">
											{R.pathOr(itemToDisplay, ['item', 'word'], '')}
										</StatusMessage>
									</Box>
								)}
							</Box>
						</Box>
					)}
				</Box>
			</Box>
			<Box flexDirection="column" alignItems="center">
				{R.findIndex(gameRounds, R.equals(itemToDisplay)) <
					gameRounds.length - 1 && (
					<Box>
						<Text bold>{figureSet.arrowRight}</Text>
						<Text>&nbsp;- next item</Text>
					</Box>
				)}
				{R.findIndex(gameRounds, R.equals(itemToDisplay)) > 0 && (
					<Box>
						<Text bold>{figureSet.arrowLeft}</Text>
						<Text>&nbsp;- previous item</Text>
					</Box>
				)}
				<Box marginTop={3}>
					<Text bold>n</Text>
					<Text>&nbsp;- start new round with random category</Text>
				</Box>
				<Box>
					<Text bold>q</Text>
					<Text>&nbsp;- quit</Text>
				</Box>
			</Box>
		</Box>
	);
}
