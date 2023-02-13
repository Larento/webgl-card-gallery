import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Vector3 } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { ItemPos } from '../types';
import { CANVAS_SIZE, ELEMENT_DEFAULT } from '../rules';
import { pxToUnits, getRandomArbitrary } from '../util';
import * as THREE from 'three';

interface OblongGeometryDef {
	width: number;
	height: number;
	radius: number;
	thickness: number;
}

function getOblong(
	{ width, height, radius, thickness }: OblongGeometryDef,
	curveSegments = 12
): THREE.ExtrudeBufferGeometry {
	const halfX = width * 0.5 - radius;
	const halfY = height * 0.5 - radius;
	const baseAngle = Math.PI * 0.5;
	const shape = new THREE.Shape();

	shape.absarc(
		halfX,
		halfY,
		radius,
		baseAngle * 0,
		baseAngle * 0 + baseAngle,
		false
	);
	shape.absarc(
		-halfX,
		halfY,
		radius,
		baseAngle * 1,
		baseAngle * 1 + baseAngle,
		false
	);
	shape.absarc(
		-halfX,
		-halfY,
		radius,
		baseAngle * 2,
		baseAngle * 2 + baseAngle,
		false
	);
	shape.absarc(
		halfX,
		-halfY,
		radius,
		baseAngle * 3,
		baseAngle * 3 + baseAngle,
		false
	);

	return new THREE.ExtrudeBufferGeometry(shape, {
		depth: thickness,
		curveSegments,
		bevelEnabled: false,
	});
}

const width = pxToUnits(ELEMENT_DEFAULT.size.width);
const height = pxToUnits(ELEMENT_DEFAULT.size.height);
const thickness = pxToUnits(ELEMENT_DEFAULT.size.thickness);
const radius = (0.15 * Math.min(width, height)) / 2;

const geom = getOblong({ width, height, thickness, radius }, 4);

export default function Card({
	id,
	name = 'Default Name',
	pos = {
		x: -CANVAS_SIZE.width / 2,
		y: -CANVAS_SIZE.height / 2,
	},
	page,
	prevPage,
	animate = false,
}) {
	const ref = useRef();
	const prevPosition = useRef(pos);

	const { animatedPosition } = useSpring({
		animatedPosition: [pxToUnits(pos.x), pxToUnits(pos.y), 0],
		from: {
			animatedPosition: [
				pxToUnits(prevPosition.current.x),
				pxToUnits(prevPosition.current.y),
				0,
			],
		},
		config: { tension: 200, friction: 25 },
		immediate: !animate || page !== prevPage,
	});

	useEffect(() => {
		prevPosition.current = pos;
	}, [pos]);

	useEffect(() => {
		if (page !== prevPage) {
			// console.log(`ID ${id} changed page from ${prevPage} to ${page}`)
		}
	}, [page]);

	const [baseColor, textColor] = useMemo(() => {
		const base = new THREE.Color();
		const text = new THREE.Color();
		const h = getRandomArbitrary(0.3, 0.62);
		const s = getRandomArbitrary(0.8, 1);
		const l = getRandomArbitrary(0.3, 0.4);

		base.setHSL(h, s, l);
		text.setHSL(h, s, 0.2 * l);
		return [base, text];
	}, []);

	return (
		<animated.group
			position={animatedPosition as unknown as Vector3}
		>
			<mesh ref={ref} geometry={geom}>
				<meshPhongMaterial color={baseColor} />
			</mesh>
			<Text
				color={textColor}
				anchorX="center"
				anchorY="top"
				position={[
					0,
					pxToUnits(ELEMENT_DEFAULT.size.height / 2 - 20),
					pxToUnits(ELEMENT_DEFAULT.size.thickness + 1),
				]}
				maxWidth={pxToUnits(ELEMENT_DEFAULT.size.width - 20)}
			>
				{`${id}. ${name}`}
			</Text>
		</animated.group>
	);
}
