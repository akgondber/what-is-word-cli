import React from 'react';
import {Box} from 'ink';

function FullScreen({children}) {
	const size = {
		columns: process.stdout.columns,
		rows: process.stdout.rows,
	};

	return (
		<Box width={size.columns} height={size.rows}>
			{children}
		</Box>
	);
}

export default FullScreen;
