import React, {
	useRef,
	useState,
	useEffect,
	useDebugValue,
	useMemo,
	useCallback,
	useImperativeHandle,
} from 'react';
import { Html } from '@react-three/drei';
import { useTransition, animated } from '@react-spring/three';
import {
	Element,
	CardItem,
	View,
	Viewport,
	Modes,
	Orientations,
	Coordinate,
} from '../types';
import {
	CAMERA,
	CANVAS_SIZE,
	ELEMENT_DEFAULT,
	PADDING_DEFAULT,
} from '../rules';
import * as Util from '../util';
import Card from './Card';
import CustomCanvas from './CustomCanvas';

import {
	uniqueNamesGenerator,
	Config,
	adjectives,
	names,
	languages,
} from 'unique-names-generator';
import { act } from '@react-three/fiber';

function fillInfo(count: number, element: Element): CardItem[] {
	const nameConfig: Config = {
		dictionaries: [adjectives, languages, names],
		separator: ' ',
		length: 3,
		style: 'capital',
	};

	const descConfig: Config = {
		dictionaries: [
			adjectives,
			names,
			languages,
			adjectives,
			names,
			languages,
			adjectives,
			names,
			languages,
			adjectives,
			names,
			languages,
			adjectives,
			names,
			languages,
			adjectives,
			names,
			languages,
			adjectives,
			names,
			languages,
		],
		separator: ' ',
		length: 21,
		style: 'capital',
	};

	return [...Array(count)].map((item, i) => ({
		element,
		pos: {
			x: 0,
			y: 0,
		},

		info: {
			id: i,
			name: uniqueNamesGenerator(nameConfig),
			desc: uniqueNamesGenerator(descConfig),
		},
		page: 0,
		prevPage: 0,
	}));
}

function getCoords(i: number, v: View) {
	//Any item that doesn't fit on one page wraps to the next page;
	const j = i % (v.columns * v.rows);
	const dist = j / v.columns;
	return {
		x: v.columns * (dist - Math.trunc(dist)),
		y: Math.trunc(dist),
	};
}

function setPageNumbers(v: View, maxSize: number): CardItem[] {
	console.log('Setting numbers');
	return v.items.map((item, i) => {
		const newPage = Math.ceil((i + 1) / maxSize);
		item.prevPage = item.page;
		item.page = newPage;
		return item;
	});
}

function updateItemCoordinates(v: View) {
	return v.items.map((item, i) => {
		const { x, y } = getCoords(i, v);
		const p0 = getInitialPosition(v);
		item.pos.x = p0.x + Util.getGridSizeInline(v) * x;
		item.pos.y = p0.y - Util.getGridSizeBlock(v) * y;
		return item;
	});
}

function getInitialPosition(v: View): Coordinate {
	// First item should be located at top-left corner
	const shiftX = -Math.min(v.viewport.width, CANVAS_SIZE.width) / 2;
	const spaceX =
		v.padding.horizontal +
		v.space.horizontal +
		(v.element.size.width + v.element.gap.horizontal) / 2;

	const shiftY =
		Math.min(v.viewport.height, CANVAS_SIZE.height) / 2;
	const spaceY = -(
		v.padding.vertical +
		v.space.vertical +
		(v.element.size.height + v.element.gap.vertical) / 2
	);

	return {
		x: shiftX + spaceX,
		y: shiftY + spaceY,
	};
}

function CardView(
	{ count, resizeDebounce = 100, maxResolution = 2, children },
	ref
) {
	const viewport = useRef({ width: 0, height: 0 });

	const [view, setView] = useState<View>(() => {
		const initialState = {
			mode: Modes.desktop,
			orientation: Orientations.horizontal,
			viewport: viewport.current,
			padding: PADDING_DEFAULT,
			space: {
				horizontal: 0,
				vertical: 0,
			},
			rows: 1,
			columns: 1,
			element: ELEMENT_DEFAULT,
			activePage: 1,
			pagesCount: 1,
			items: [],
		};

		return {
			...initialState,
			items: fillInfo(count, initialState.element),
		};
	});

	const actions = useImperativeHandle(
		ref,
		() => {
			return {
				prevPage: () =>
					setView((view) => ({
						...view,
						activePage: Math.max(view.activePage - 1, 1),
					})),
				nextPage: () =>
					setView((view) => ({
						...view,
						activePage: Math.min(
							view.activePage + 1,
							view.pagesCount
						),
					})),
			};
		},
		[]
	);

	const updateView = useCallback((prevState: View): View => {
		const newState = { ...prevState };

		newState.viewport = viewport.current;
		newState.orientation = Util.getOrientation(newState.viewport);
		newState.rows = Util.getRows(newState);
		newState.columns = Util.getColumns(newState);

		newState.space.horizontal = Util.getSpaceInline(newState);
		newState.space.vertical = Util.getSpaceBlock(newState);

		const maxSize = newState.columns * newState.rows;
		newState.items = setPageNumbers(newState, maxSize);
		newState.items = updateItemCoordinates(newState);

		const relativePagePosition =
			newState.activePage / newState.pagesCount;
		const newPagesCount = Math.ceil(
			newState.items.length / maxSize
		);
		const newActivePage = Math.round(
			relativePagePosition * newPagesCount
		);

		console.log(
			`${relativePagePosition}, ${newState.activePage}, ${newState.pagesCount}`
		);
		console.log(
			`${relativePagePosition}, ${newActivePage}, ${newPagesCount}`
		);

		newState.activePage =
			newState.pagesCount > 1 ? newActivePage : 1;
		newState.pagesCount = newPagesCount;

		return newState;
	}, []);

	const getCanvasViewport = useCallback((v: Viewport) => {
		viewport.current = v;
		setView(updateView);
	}, []);

	const pages = useMemo(
		() => [...Array(view.pagesCount)],
		[view.items]
	);

	return (
		<CustomCanvas
			onResize={getCanvasViewport}
			resizeDebounce={resizeDebounce}
		>
			<>
				{pages.map((page, i) => {
					const pageID = i + 1;
					const items = view.items.filter(
						(item) => item.page === pageID
					);
					const relativePos = pageID - view.activePage;

					return pageID > view.activePage + 1 ||
						pageID < view.activePage - 1 ? (
						''
					) : (
						<group
							position={[
								view.viewport.width * relativePos,
								0,
								0,
							]}
							key={pageID}
						>
							{items.map((item) => (
								<Card
									key={item.info.name}
									id={item.info.id + 1}
									name={`${item.info.name}, page:${item.page}`}
									pos={{
										x: item.pos.x,
										y: item.pos.y,
									}}
									page={item.page}
									prevPage={item.prevPage}
									animate={false}
								/>
							))}
						</group>
					);
				})}
			</>
			{children}
		</CustomCanvas>
	);
}

export default React.forwardRef(CardView);
