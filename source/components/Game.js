import React, {useContext, useEffect} from 'react';
import {Text, Box, useInput} from 'ink';
import Gradient from 'ink-gradient';
import TextInput from 'ink-text-input';
import {Alert, StatusMessage} from '@inkjs/ui';
import * as R from 'remeda';
import {listenKeys} from 'nanostores';
import {useStore} from '@nanostores/react';
import delay from 'delay';
import {manager as appManager, $roundItem, $suite} from '../store.js';
import {useScreenSize} from '../hooks/useScreenSize.js';
import {
	$newLines,
	$definitionHeight,
	actions as roundActions,
	$panelHeight,
} from '../store/round.js';
import {
	$status,
	actions as statusActions,
	manager as statusManager,
	statuses,
} from '../store/status.js';
import {
	$score,
	$userInput,
	$gameRounds,
	manager as gameManager,
	scoreActions,
	$lastUserAnswer,
} from '../store/game.js';
import {getId, getSuiteBySettings} from '../helpers.js';
import {SettingsContext} from '../app.js';

export default function Game() {
	const definitionHeight = useStore($definitionHeight);
	const escapingCharsPanelHeight = useStore($panelHeight);
	const newLines = useStore($newLines);
	useStore($status);
	const roundItem = useStore($roundItem);
	const suite = useStore($suite);
	const gameRounds = useStore($gameRounds);
	const score = useStore($score);
	const userInput = useStore($userInput);
	const lastUserAnswer = useStore($lastUserAnswer);
	const {settings} = useContext(SettingsContext);
	const {width, height} = useScreenSize();

	useEffect(() => {
		listenKeys($roundItem, ['definition'], value => {
			roundActions.calculateDefinitionHeight(value.definition);
		});
		const unbindDefintionHeightListener = $definitionHeight.subscribe(value => {
			roundActions.setNewLines(height - value - 9);
			roundActions.setPanelHeight(height - value - 6);
		});
		const unbindFinishedListener = $status.subscribe(value => {
			if (value === statuses.finished) {
				appManager.displayNextResult();
			}
		});

		appManager.displayNextResult();

		return () => {
			unbindDefintionHeightListener();
			unbindFinishedListener();
			clearInterval($roundItem.get().intervalId);
			console.clear();
		};
	}, [height]);

	const startNewRound = () => {
		appManager.setupNextRound();
		statusActions.setRunning();
		roundActions.setNewLines(process.stdout.rows - definitionHeight - 9);

		const intervalId = setInterval(async () => {
			const newLines = roundActions.decrement();

			appManager.setRoundTemplate();

			if (newLines < 0) {
				clearInterval(intervalId);
				gameManager.setErrored();
				statusActions.setDisplayingResult();
				await delay(600);

				if ($suite.get().length === $gameRounds.get().length) {
					statusActions.setFinished();
				} else {
					startNewRound();
				}
			}
		}, 1000);
		appManager.setIntervalId(intervalId);
		return intervalId;
	};

	useInput(
		(input, _key) => {
			if (input === 'y') {
				roundActions.setPanelHeight(process.stdout.rows - definitionHeight - 5);

				appManager.setSuite(getSuiteBySettings(settings).items);

				const intervalId = startNewRound();
				appManager.setIntervalId(intervalId);
				statusActions.setRunning();
			}
		},
		{isActive: statusManager.isPaused()},
	);
	const lastGameRound = R.last(gameRounds);

	return statusManager.isRunning() || statusManager.isDisplayingResult() ? (
		<Box
			width={width}
			height={height}
			flexDirection="column"
			alignItems="center"
		>
			<Box alignSelf="flex-end" marginBottom={1}>
				<Box alignSelf="flex-end" borderStyle="single">
					<Text>Trial {$gameRounds.get().length}</Text>
					<Text>&nbsp;of</Text>
					<Text>&nbsp;{$suite.get().length}</Text>
				</Box>
				<Box alignSelf="flex-end" borderStyle="single">
					<Text>Score: {score}</Text>
				</Box>
			</Box>
			<Box flexDirection="column" marginBottom={1}>
				<Box
					height={definitionHeight}
					alignItems="center"
					justifyContent="center"
				>
					<Text color="#89d">{roundItem.definition}</Text>
				</Box>
			</Box>
			{statusManager.isDisplayingResult() ? (
				R.isDefined(lastGameRound) && (
					<Box
						flexDirection="column"
						height={escapingCharsPanelHeight}
						justifyContent="center"
						alignItems="center"
					>
						<Box>
							<Alert
								variant={
									lastGameRound.status === 'success' ? 'success' : 'error'
								}
							>
								{lastGameRound.message}
							</Alert>
						</Box>
					</Box>
				)
			) : (
				<Box
					flexDirection="column"
					height={escapingCharsPanelHeight}
					alignItems="center"
				>
					<Box>
						<Text>{R.times(roundItem.word.length, () => '-')}</Text>
					</Box>

					<Box flexDirection="column">
						<Box height={newLines} />
						{roundItem.template.map(chars => (
							<Text key={getId()}>{chars.join('')}</Text>
						))}
					</Box>
				</Box>
			)}
			<Box marginTop={1} alignItems="center" justifyContent="center">
				<Text>Answer:&nbsp;</Text>
				<Box
					borderStyle="single"
					borderColor="#e90"
					borderTop={false}
					borderLeft={false}
					borderRight={false}
				>
					{!statusManager.isPaused() && (
						<TextInput
							placeholder="What is it?"
							value={userInput}
							onChange={value => {
								gameManager.setInput(value);
							}}
							onSubmit={async value => {
								if (value === roundItem.word) {
									clearInterval(roundItem.intervalId);
									gameManager.setSucceeded(value);
									gameManager.resetInput();

									scoreActions.increment();

									statusActions.setDisplayingResult();
									await delay(600);

									if (suite.length === $gameRounds.get().length) {
										statusActions.setFinished();
										return;
									}

									startNewRound();
								} else {
									gameManager.registerUserAnswer(userInput);
									gameManager.resetInput();
								}
							}}
						/>
					)}
				</Box>
				<Box paddingLeft={2} flexDirection="row" justifyContent="space-around">
					{R.isEmpty(lastUserAnswer) ? (
						<Text color="green" />
					) : (
						<StatusMessage variant="error">{lastUserAnswer}</StatusMessage>
					)}
				</Box>
			</Box>
		</Box>
	) : (
		<Box
			width={width}
			height={height}
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			paddingX={2}
		>
			<Box>
				<Gradient name="teen">
					<Text>WHAT-IS-WORD</Text>
				</Gradient>
			</Box>
			<Box marginTop={3}>
				<Text>
					Try to unscramble words by given definition and provide a correct
					word.
				</Text>
			</Box>
			<Box paddingBottom={3}>
				<Text>
					You must be in time before the scrambled word reaches dashed borders.
				</Text>
			</Box>
			<Box>
				<Text>
					Are you ready? Press{' '}
					<Text bold color="cyan">
						y
					</Text>{' '}
					to start.
				</Text>
			</Box>
		</Box>
	);
}
