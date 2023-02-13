import {
	PossibleElementsNumbers,
	Element,
	ViewPadding,
} from './types';
import { toRadians, pxToUnits } from './util';

export const PX_PER_UNIT = 15;
export const CANVAS_SIZE = {
	width: 1920,
	height: 1080,
};

const SCENE_SIZE = {
	width: pxToUnits(CANVAS_SIZE.width),
	height: pxToUnits(CANVAS_SIZE.height),
};

const CAMERA_FOV = 90;
export const CAMERA_DIST =
	SCENE_SIZE.height / (2 * Math.tan(toRadians(CAMERA_FOV / 2)));

export const CAMERA = {
	fov: CAMERA_FOV,
	near: CAMERA_DIST * 0.01,
	far: CAMERA_DIST * 1.5,
	position: [0, 0, CAMERA_DIST],
};

export const PADDING_DEFAULT: ViewPadding = {
	horizontal: 40,
	vertical: 20,
};

export const ELEMENT_DEFAULT: Element = {
	size: {
		width: 160,
		height: 200,
		thickness: 10,
	},

	gap: {
		horizontal: 40,
		vertical: 40,
	},
};

export const VIEW_RULES: PossibleElementsNumbers = {
	desktop: {
		horizontal: {
			rows: {
				min: 1,
				max: 4,
			},
			columns: {
				min: 1,
				max: 7,
			},
		},

		vertical: {
			rows: {
				min: 2,
				max: 6,
			},
			columns: {
				min: 2,
				max: 4,
			},
		},
	},

	mobile: {
		horizontal: {
			rows: {
				min: 1,
				max: 2,
			},
			columns: {
				min: 3,
				max: 7,
			},
		},

		vertical: {
			rows: {
				min: 3,
				max: 7,
			},
			columns: {
				min: 1,
				max: 2,
			},
		},
	},
};
