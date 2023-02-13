import React, { useRef, useState, useEffect } from 'react';
import CardView from './components/CardView';
import { CAMERA, CAMERA_DIST } from './rules';
import { pxToUnits } from './util';

export default function App() {
	console.log('rerender');
	const [page, setPage] = useState(1);
	const viewRef = useRef(null);

	return (
		<React.StrictMode>
			<CardView ref={viewRef} count={100} resizeDebounce={200}>
				<ambientLight />
				<pointLight
					args={[0, pxToUnits(100), pxToUnits(50)]}
					color="white"
					intensity={1}
				/>
			</CardView>
			<div className="navigation">
				<button
					id="prev"
					onClick={() => viewRef.current.prevPage()}
				>
					Prev
				</button>
				<button
					id="next"
					onClick={() => viewRef.current.nextPage()}
				>
					Next
				</button>
			</div>
		</React.StrictMode>
	);
}

// import React, { useState } from "react";
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls, Html } from '@react-three/drei';
// import Card3D, { cardDef } from "./Card3D";
// import Card from "./Card";
// import { Flex, Box } from '@react-three/flex';
// import { arrayBuffer } from "stream/consumers";
// import useMeasure from 'react-use-measure'

// interface GalleryProps {
//     items: number
// }

// const maxColumns = 9;
// const maxRows = 5;
// const minColums = 1;
// const minRows = 1;

// function Gallery({items}: GalleryProps): JSX.Element {
//     const gap = 1;
//     const { viewport, size } = useThree();
//     const [itemsCount, setItemsCount] = useState(items);

//     return (
//         <Flex
//             position={[-viewport.width / 2, viewport.height / 2, 0]} size={[viewport.width, viewport.height, 0]}
//             justifyContent="center"
//             alignItems="flex-start"
//             flexDirection="row"
//             flexWrap="wrap"
//             padding={gap / 2}
//             onReflow={(totalWidth, totalHeight) => console.log(`total - width: ${totalWidth}, height: ${totalHeight} \n viewport - width: ${viewport.width}, height: ${viewport.height}`)}
//         >
//         {
//             [...Array(itemsCount)].map(item => (
//                 <Box margin={gap / 2} centerAnchor>
//                     <Card3D/>
//                 </Box>
//             ))
//         }
//         </Flex>
//     );
// }

// function NewGal(): JSX.Element {
//     const { camera, viewport, size, setSize } = useThree();
//     const [itemsCount, setItemsCount] = useState(10);

//     // const desiredWidth = 320;
//     // const desiredHeight = 240;

//     // const currentSize = size;
//     // const x = (currentSize.width / 2) - (desiredWidth/2);
//     // const y = (currentSize.height / 2) - (desiredHeight/2);

//     // // Set the size of the renderer to the correct desired output size
//     // setSize(desiredWidth, desiredHeight, false);

//     // // The camera its is one that should be cropped
//     // // This is referred to as the view offset in three.js
//     // camera.setViewOffset(currentSize.width, currentSize.width, x, y, desiredWidth, desiredHeight);

//     return (
//     <>
//         {
//             [...Array(itemsCount)].map((item, i) => (
//                 <Card3D posX={5 * (i) - viewport.width/2 + cardDef.width}/>
//             ))
//         }
//         <Html>
//             <div>{viewport.width}</div>
//             <div>{viewport.height}</div>
//         </Html>
//     </>
//     );
// }

// function Container() {
//     const { viewport, size } = useThree();

//     return (
//         <Flex
//             position={[-viewport.width / 2, viewport.height / 2, 0]} size={[viewport.width, viewport.height, 0]}
//             justifyContent="center"
//             alignItems="flex-start"
//             flexDirection="row"
//             flexWrap="wrap"
//             padding={0.5}
//         >
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//             <Box margin={0.5} centerAnchor>
//                 <Card3D/>
//             </Box>
//         </Flex>
//     );
// }

// export default function App() {

//     const [ref, bounds] = useMeasure();

//     return (
//     <>
//         <div ref={ref} id="view">
//             <Canvas
//             resize={{scroll: false, debounce: 400}}
//             camera={{ fov: 40, near: 0.1, far: 50, position: [0, 0, 35] }}
//             dpr={[1, 2]}>
//                 <ambientLight intensity={0.25}/>
//                 <pointLight position={[0, 30, 20]} intensity={1} />
//                 <NewGal/>
//                 <OrbitControls enableDamping={false} enablePan={true} enableZoom={true} enableRotate={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
//             </Canvas>
//         </div>

//         <div id="wrapper-pagination">
//             <div id="pagination">
//                 <button id="prev">Prev</button>
//                 <span id="currentPage">0</span>
//                 <span>/</span>
//                 <span id="pagesCount">0</span>
//                 <button id="next">Next</button>
//                 <span>{bounds.height}</span>
//             </div>
//         </div>
//     </>
//     );
// }
