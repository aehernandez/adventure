import React from 'react';
import { GameObject } from './object';

export class EnemyGeneric extends GameObject {
	component = (
		<span
			css={`color: ${props => props.theme.alert};`}
		>
		X
		</span>
	)
}
