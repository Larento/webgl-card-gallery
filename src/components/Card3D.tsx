import * as THREE from 'three';
import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import Card from './Card';
import {
	Blending,
	Color,
	PlaneBufferGeometry,
	PlaneGeometry,
	Vector2,
} from 'three';
import { buffer } from 'stream/consumers';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { group } from 'console';
import '../styles/Card.scss';

const loader = new SVGLoader();

interface Card3DProps {
	posX?: number;
	posY?: number;
}

interface OblongGeometryDef {
	width: number;
	height: number;
	radius: number;
	thickness: number;
}

function getOblong({
	width,
	height,
	radius,
	thickness,
}: OblongGeometryDef): THREE.ExtrudeBufferGeometry {
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
		bevelEnabled: false,
	});
}

interface CircularGeometryDef {
	radius: number;
	thickness: number;
}

function getCircular({
	radius,
	thickness,
}: CircularGeometryDef): THREE.ExtrudeBufferGeometry {
	const shape = new THREE.Shape();
	shape.absarc(0, 0, radius, 0, 2 * Math.PI, false);

	return new THREE.ExtrudeBufferGeometry(shape, {
		depth: thickness,
		bevelEnabled: false,
	});
}

interface IconSize {
	x: number;
	y: number;
}

interface IconSVGProps {
	svgData: string;
	size: IconSize;
	scale: number;
	color?: string | Color;
}

function IconSVG({
	svgData,
	size,
	scale,
	color = 'white',
}: IconSVGProps): JSX.Element {
	const svg = loader.parse(svgData);
	const paths = svg.paths;

	return (
		<group
			scale={scale}
			scale-y={-scale}
			position={[
				-(size.x * scale) / 2,
				(size.y * scale) / 2,
				buttonDef.thickness + 0.01,
			]}
		>
			{paths.map((path) =>
				path.toShapes(true).map((shape) => (
					<mesh>
						<extrudeBufferGeometry
							args={[
								shape,
								{ depth: 0.2, bevelEnabled: false },
							]}
						/>
						<meshBasicMaterial color={color} />
					</mesh>
				))
			)}
		</group>
	);
}

interface Button3DProps {
	posX?: number;
	posY: number;
	buttonGeometry: THREE.BufferGeometry;
	svg: string;
	iconSize: IconSize;
	iconScale: number;
	color: Color | string;
	onClick: Function;
}

function Button3D({
	posX = 0,
	posY,
	buttonGeometry,
	svg,
	iconSize,
	iconScale,
	color,
	onClick,
}: Button3DProps): JSX.Element {
	const [active, setActive] = useState(false);
	const posZ = cardDef.thickness / 2 + 0.01;

	const { position } = useSpring({
		position: active
			? [posX, posY, posZ - buttonDef.thickness * 0.75]
			: [posX, posY, posZ],
		config: config.wobbly,
	});

	return (
		<animated.group
			position={position as any}
			onClick={onClick as any}
			onPointerDown={(e) => setActive(true)}
			onPointerUp={(e) => setActive(false)}
			onPointerLeave={(e) => setActive(false)}
		>
			<mesh geometry={buttonGeometry}>
				<meshPhongMaterial color={color} />
			</mesh>

			<IconSVG
				svgData={svg}
				size={iconSize}
				scale={iconScale}
			/>
		</animated.group>
	);
}

const playIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>`;

const infoIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z"/></svg>`;

const buttonGap = 0.4;
export const cardDef: OblongGeometryDef = {
	width: 3.5,
	height: 4.5,
	radius: 0.1,
	thickness: 0.25,
};
const cardGeometry = getOblong(cardDef);

const buttonDef: OblongGeometryDef = {
	width: cardDef.width - buttonGap * 2,
	height: (cardDef.height - 3 * buttonGap) / 2,
	radius: 0.5,
	thickness: 0.1,
};
const buttonGeometry = getOblong(buttonDef);

export default function Card3D({
	posX = 0,
	posY = 0,
}: Card3DProps): JSX.Element {
	const myMesh = React.useRef();

	const [hover, setHover] = useState(false);
	const [active, setActive] = useState(false);

	const { scale } = useSpring({
		scale: hover || active ? 1.07 : 1,
		config: config.stiff,
	});

	const { rotation, position } = useSpring({
		position: active ? [posX, posY, 0] : [posX, posY, 0],
		rotation: active
			? [(0 / 180) * Math.PI, 2 * Math.PI, (-0 / 180) * Math.PI]
			: [0, Math.PI, 0],
		config: config.default,
	});

	// useFrame(({ clock }) => {
	//     Math.sin(myMesh.current.rotation.y = clock.getElapsedTime() + phase);
	// })

	function onPlay(e) {
		if (active) {
			e.stopPropagation();
			console.log('clicked play', e);
		}
	}

	function onInfo(e) {
		if (active) {
			e.stopPropagation();
			console.log('clicked info', e);
		}
	}

	return (
		<animated.group
			scale={scale}
			position={position as any}
			rotation={rotation as any}
			onPointerOver={(e) => setHover(true)}
			onPointerOut={(e) => setHover(false)}
			onPointerMissed={(e) => setActive(false)}
		>
			<mesh
				position={[0, 0, -cardDef.thickness / 2]}
				ref={myMesh}
				geometry={cardGeometry}
				onClick={(e) => {
					setActive(true);
				}}
			>
				<meshPhongMaterial color="snow" />
			</mesh>

			<Button3D
				posY={(buttonDef.height + buttonGap) / 2}
				svg={playIconSVG}
				iconSize={{ x: 300, y: 512 }}
				iconScale={1 / 600}
				buttonGeometry={buttonGeometry}
				color="chartreuse"
				onClick={onPlay}
			/>

			<Button3D
				posY={-(buttonDef.height + buttonGap) / 2}
				svg={infoIconSVG}
				iconSize={{ x: 512, y: 512 }}
				iconScale={1 / 400}
				buttonGeometry={buttonGeometry}
				color="tomato"
				onClick={onInfo}
			/>
		</animated.group>
	);
}
