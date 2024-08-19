import { config } from '@/theme/_config';

import type {
	BorderColors,
	BorderWidths,
	BorderRadius,
	BorderTopRadius,
	BorderBottomRadius,
} from '@/types/theme/borders';
import type { UnionConfiguration } from '@/types/theme/config';
import type { ViewStyle } from 'react-native';
import { SizeFuncResult } from './hooks/useSize';

/**
 * Generates border color styles from configuration
 * @param configuration
 */
export const generateBorderColors = (configuration: UnionConfiguration) => {
	return Object.entries(configuration.borders.colors ?? {}).reduce(
		(acc, [key, value]) => {
			return Object.assign(acc, {
				[`${key}`]: {
					borderColor: value,
				},
			});
		},
		{} as BorderColors,
	);
};

/**
 * Generates border radius styles from configuration
 */
export const generateBorderRadius = (
	size: (target: number) => SizeFuncResult,
) => {
	return config.borders.radius.reduce((acc, radius) => {
		return Object.assign(acc, {
			[`rounded_${size(radius).height}`]: {
				borderRadius: size(radius).height,
			},
			[`roundedTop_${size(radius).height}`]: {
				borderTopLeftRadius: size(radius).height,
				borderTopRightRadius: size(radius).height,
			},
			[`roundedBottom_${size(radius).height}`]: {
				borderBottomLeftRadius: size(radius).height,
				borderBottomRightRadiusRadius: size(radius).height,
			},
		});
	}, {} as BorderRadius & BorderTopRadius & BorderBottomRadius);
};

/**
 * Generates border width styles from configuration
 */
export const generateBorderWidths = (
	size: (target: number) => SizeFuncResult,
) => {
	return config.borders.widths.reduce((acc, width) => {
		return Object.assign(acc, {
			[`w_${size(width).width}`]: {
				borderWidth: width,
			},
			[`wTop_${size(width).width}`]: {
				borderTopWidth: width,
			},
			[`wBottom_${size(width).width}`]: {
				borderBottomWidth: width,
			},
			[`wLeft_${size(width).width}`]: {
				borderLeftWidth: width,
			},
			[`wRight_${size(width).width}`]: {
				borderRightWidth: size(width).width,
			},
		});
	}, {} as BorderWidths);
};

/**
 * Static border styles
 * @desc These styles are not generated from configuration, you can add your own
 */
export const staticBorderStyles = {} as const satisfies Record<
	string,
	ViewStyle
>;
