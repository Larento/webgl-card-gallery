import React, {
	useRef,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from 'react';
import {
	useThree,
	Canvas,
	RootState,
	useFrame,
} from '@react-three/fiber';
import useResizeObserver from 'use-resize-observer';
import { debounce } from 'lodash';
import { View, Viewport, Orientations } from '../types';
import * as Util from '../util';
import { CANVAS_SIZE, VIEW_RULES, CAMERA } from '../rules';

export default function CustomCanvas({
	children,
	resizeDebounce,
	onResize,
	camera = CAMERA,
}): JSX.Element {
	const canvasRef = useRef<HTMLCanvasElement>();
	const containerRef = useRef<HTMLDivElement>();
	const gotGlState = useRef(false);

	const [viewport, setViewport] = useState<Viewport>({
		width: 0,
		height: 0,
	});

	const updateViewport = useCallback(({ width, height }) => {
		setViewport((prevState) => ({
			...prevState,
			width,
			height,
		}));
	}, []);

	const debouncedResize = useMemo(
		() => debounce(updateViewport, resizeDebounce),
		[resizeDebounce]
	);

	const setGlState = useCallback((state: RootState) => {
		gotGlState.current = true;
	}, []);

	const observer = useResizeObserver<HTMLDivElement>({
		ref: containerRef,
		onResize: debouncedResize,
	});

	useEffect(() => {
		if (gotGlState.current) {
			onResize(viewport);
		}
	}, [viewport]);

	return (
		<div id="view" ref={containerRef} className="container">
			<div className="wrap" style={{ ...CANVAS_SIZE }}>
				<Canvas
					ref={canvasRef}
					dpr={[1, 1.5]}
					resize={{ scroll: false, debounce: 0 }}
					camera={{
						aspect:
							CANVAS_SIZE.width / CANVAS_SIZE.height,
						...camera,
					}}
					onCreated={setGlState}
				>
					{children}
				</Canvas>
			</div>
		</div>
	);
}
