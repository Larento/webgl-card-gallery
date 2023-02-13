import { useRef, useEffect } from 'react';
import { Viewport, View, Orientations, Element } from './types';
import { VIEW_RULES, PX_PER_UNIT } from './rules';

export function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

export function usePrevious(value: number) {
	const ref = useRef<number | null>(null);
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

export function chunks(array: any[], chunkSize: number) {
	if (array.length <= chunkSize) return array;
	let chunksArray = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunksArray.push(array.slice(i, i + chunkSize));
	}
	return chunksArray;
}

export function toRadians(angle: number) {
	return angle * (Math.PI / 180);
}

export function unitsToPx(units: number) {
	return units * PX_PER_UNIT;
}

export function pxToUnits(px: number) {
	return px / PX_PER_UNIT;
}

export function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}

export function debounce(fn: () => void, ms: number): () => void {
	let timer: any;
	return function () {
		clearTimeout(timer);
		const args = Array.prototype.slice.call(arguments);
		args.unshift(this);
		timer = setTimeout(fn.bind.apply(fn, args), ms);
	};
}

export function getPossibleRows(v: View) {
	return VIEW_RULES[v.mode][v.orientation].rows;
}

export function getPossibleColumns(v: View) {
	return VIEW_RULES[v.mode][v.orientation].columns;
}

export function getGridSizeInline(v: View) {
	return v.element.gap.horizontal + v.element.size.width;
}

export function getGridSizeBlock(v: View) {
	return v.element.gap.vertical + v.element.size.height;
}

export function getGridDimInline(v: View) {
	return v.viewport.width - 2 * v.padding.horizontal;
}

export function getGridDimBlock(v: View) {
	return v.viewport.height - 2 * v.padding.vertical;
}

export function getMaxInline(v: View) {
	return Math.floor(getGridDimInline(v) / getGridSizeInline(v));
}

export function getMaxBlock(v: View) {
	return Math.floor(getGridDimBlock(v) / getGridSizeBlock(v));
}

export function getRows(v: View) {
	const possibleRows = getPossibleRows(v);
	return clamp(getMaxBlock(v), possibleRows.min, possibleRows.max);
}

export function getColumns(v: View) {
	const possibleColumns = getPossibleColumns(v);
	return clamp(
		getMaxInline(v),
		possibleColumns.min,
		possibleColumns.max
	);
}

export function getSpaceInline(v: View) {
	return (
		0.5 *
		(getGridDimInline(v) - getColumns(v) * getGridSizeInline(v))
	);
}

export function getSpaceBlock(v: View) {
	return (
		0.5 * (getGridDimBlock(v) - getRows(v) * getGridSizeBlock(v))
	);
}

export function getOrientation(vp: Viewport) {
	const ratio = vp.width / vp.height;
	return ratio >= 1
		? Orientations.horizontal
		: Orientations.vertical;
}
