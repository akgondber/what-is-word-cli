import {useEffect, useState} from 'react';
import {useStdout} from 'ink';

export const useScreenSize = () => {
	const {stdout} = useStdout();

	const [size, setSize] = useState(() => ({
		width: stdout.columns - 2,
		height: stdout.rows - 2,
	}));

	useEffect(() => {
		const onResize = () =>
			setSize({
				width: stdout.columns,
				height: stdout.rows,
			});

		stdout.on(`resize`, onResize);
		return () => {
			stdout.off(`resize`, onResize);
		};
	}, [stdout]);

	return size;
};
