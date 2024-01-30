import test from 'ava';
import * as R from 'remeda';
import * as helpers from '../source/helpers.js';

test('reverts value', t => {
	const result = helpers.revertValue({bar: true}, 'bar');
	t.false(result.bar);
});

test('returns random string', t => {
	const result = helpers.getId();
	t.true(R.pipe([...result], R.uniq(), R.length) > 2);
});
