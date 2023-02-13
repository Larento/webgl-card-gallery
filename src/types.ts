export interface ViewPadding {
	horizontal: number;
	vertical: number;
}

interface ViewElementsNumber {
	min: number;
	max: number;
}

interface ElementSize {
	width: number;
	height: number;
	thickness: number;
}

interface ElementGap {
	horizontal: number;
	vertical: number;
}

export enum Modes {
	desktop = 'desktop',
	mobile = 'mobile',
}

export enum Orientations {
	horizontal = 'horizontal',
	vertical = 'vertical',
}

export interface Element {
	size: ElementSize;
	gap: ElementGap;
}

export interface Viewport {
	width: number;
	height: number;
}

export interface View {
	mode: Modes;
	orientation: Orientations;
	viewport: Viewport;
	padding: ViewPadding;
	space: ViewPadding;
	rows: number;
	columns: number;
	element: Element;
	activePage: number;
	pagesCount: number;
	items: CardItem[];
}

export interface ItemPos {
	x: number;
	y: number;
}

export interface ItemInfo {
	id: number;
	name: string;
	desc: string;
}

export interface CardItem {
	element: Element;
	pos: ItemPos;
	info: ItemInfo;
	page: number;
	prevPage: number;
}

export type PossibleElementsNumbers = {
	[key in Modes]: {
		[key in Orientations]: {
			rows: ViewElementsNumber;
			columns: ViewElementsNumber;
		};
	};
};

export interface Coordinate {
	x: number;
	y: number;
}
