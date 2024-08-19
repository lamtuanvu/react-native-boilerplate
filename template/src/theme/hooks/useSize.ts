import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';

// This is the base dimensions of the iPhone 15 in portrait mode which is used to calculate the responsive sizes.
// Keep in mind to use exact device for development and testing.
const BASE_SCREEN_WIDTH = 393;
const BASE_SCREEN_HEIGHT = 852;

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

export const useSize = () => {
	const [dimensions, setDimensions] = useState({ window, screen });

	useEffect(() => {
		Dimensions.addEventListener('change', ({ window, screen }) =>
			setDimensions({ window, screen }),
		);
	}, []);

	const mainHeight = useMemo(() => {
		return dimensions.window.height;
	}, [dimensions.window.height]);

	const mainWidth = useMemo(() => {
		return dimensions.window.width;
	}, [dimensions.window.width]);

	const getBaseSize = useCallback(() => {
		if (mainHeight > mainWidth) {
			return {
				currentHeight: mainHeight,
				currentWidth: mainWidth,
				baseHeight: BASE_SCREEN_HEIGHT,
				baseWidth: BASE_SCREEN_WIDTH,
			};
		}
		return {
			currentHeight: mainHeight,
			currentWidth: mainWidth,
			baseHeight: BASE_SCREEN_WIDTH,
			baseWidth: BASE_SCREEN_HEIGHT,
		};
	}, [mainHeight, mainWidth]);

	const size = useCallback(
		(targetSize: number): SizeFuncResult => {
			const { baseHeight, baseWidth, currentHeight, currentWidth } =
				getBaseSize();
			return {
				height: (targetSize / baseHeight) * currentHeight,
				width: (targetSize / baseWidth) * currentWidth,
			};
		},
		[getBaseSize],
	);

	const width = useCallback(
		(percentage: number) => {
			return (percentage / 100) * mainWidth;
		},
		[mainWidth],
	);

	const height = useCallback(
		(percentage: number) => {
			return (percentage / 100) * mainHeight;
		},
		[mainHeight],
	);

	const fontSize = useCallback(
		(targetFontSize: number) => {
			// const multiplier = 740;
			const { baseHeight, baseWidth, currentHeight, currentWidth } =
				getBaseSize();
			const baseWidthDimension =
				baseHeight > baseWidth ? baseWidth : baseHeight;
			const baseAspectRatioBasedHeight =
				(baseHeight / baseWidth) * baseWidthDimension;
			const maxBase = Math.sqrt(
				baseAspectRatioBasedHeight ** 2 + baseWidthDimension ** 2,
			);
			const percentage = (targetFontSize / maxBase) * 100;

			const currentBaseWidthDimension =
				currentHeight > currentWidth ? currentWidth : currentHeight;
			const currentBaseAspectRatioBasedHeight =
				(baseHeight / baseWidth) * currentBaseWidthDimension;
			const currentMaxBase = Math.sqrt(
				currentBaseAspectRatioBasedHeight ** 2 + currentBaseWidthDimension ** 2,
			);
			const baseAspectRatio = BASE_SCREEN_HEIGHT / BASE_SCREEN_WIDTH;
			const currentAspectRatio =
				currentHeight > currentWidth
					? currentHeight / currentWidth
					: currentWidth / currentHeight;
			return (
				(percentage * currentMaxBase) /
				((baseAspectRatio / currentAspectRatio) * 100)
			);
		},
		[getBaseSize],
	);

	return { size, fontSize, height, width };
};

export type Size = ReturnType<typeof useSize>;
export type SizeFuncProps = { targetSize: number };
export type SizeFuncResult = { height: number; width: number };
