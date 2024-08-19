import type { ViewStyle } from 'react-native';
import type {
  BorderBottomRadius,
  BorderColors,
  BorderRadius,
  BorderTopRadius,
  BorderWidths,
} from '@/theme/types/borders';
import type { UnionConfiguration } from '@/theme/types/config';

import { config } from '@/theme/_config';
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
// export const generateBorderRadius = () => {
//   return config.borders.radius.reduce(
//     (acc, radius) => {
//       return Object.assign(acc, {
//         [`rounded_${radius}`]: {
//           borderRadius: radius,
//         },
//         [`roundedBottom_${radius}`]: {
//           borderBottomLeftRadius: radius,
//           borderBottomRightRadius: radius,
//         },
//         [`roundedBottomRight_${radius}`]: {
//           borderBottomRightRadius: radius,
//         },
//         [`roundedTop_${radius}`]: {
//           borderTopLeftRadius: radius,
//           borderTopRightRadius: radius,
//         },
//         [`roundedTopLeft_${radius}`]: {
//           borderTopLeftRadius: radius,
//         },
//       });
//     },
//     {} as BorderBottomRadius & BorderRadius & BorderTopRadius,
//   );
export const generateBorderRadius = (
	size: (target: number) => SizeFuncResult,
) => {
	return config.borders.radius.reduce((acc, radius) => {
		return Object.assign(acc, {
			[`rounded_${size(radius).height}`]: {
				borderRadius: size(radius).height,
			},
      [`roundedBottomRight_${size(radius).height}`]: {
        borderBottomRightRadius: size(radius).height,
      },
      [`roundedBottomLeft_${size(radius).height}`]: {
        borderBottomLeftRadius: size(radius).height,
      },
			[`roundedBottom_${size(radius).height}`]: {
				borderBottomLeftRadius: size(radius).height,
				borderBottomRightRadiusRadius: size(radius).height,
			},
			[`roundedTop_${size(radius).height}`]: {
				borderTopLeftRadius: size(radius).height,
				borderTopRightRadius: size(radius).height,
			},
      [`roundedTopLeft_${size(radius).height}`]: {
        borderTopLeftRadius: size(radius).height,
      },
      [`roundedTopRight_${size(radius).height}`]: {
        borderTopRightRadius: size(radius).height,
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
			[`wBottom_${size(width).width}`]: {
				borderBottomWidth: width,
			},
			[`wLeft_${size(width).width}`]: {
				borderLeftWidth: width,
			},
			[`wRight_${size(width).width}`]: {
				borderRightWidth: size(width).width,
			},
			[`wTop_${size(width).width}`]: {
				borderTopWidth: width,
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
