;import CONFIG from "../constants/constants";
import * as math from "mathjs";

function increaseMagnitudeMatrix(vector: math.Matrix, p: number): math.Matrix {
	// Calculate the current magnitude of the vector
	const currentMagnitude = math.sqrt(math.sum(math.dotMultiply(vector, vector)));

	if (currentMagnitude >= CONFIG.MAX_VEL) // Don't increase further
		return (vector);
  
	// Calculate the unit vector (vector with magnitude 1)
	const unitVector: math.Matrix = math.divide(vector, currentMagnitude) as math.Matrix;
  
	// Calculate the new magnitude
	const newMagnitude = currentMagnitude + p;
  
	// Scale the unit vector by the new magnitude
	const newVector: math.Matrix = math.multiply(unitVector, newMagnitude) as math.Matrix;
  
	return newVector;
  }

const deflectionMatrixBorder: math.Matrix = math.matrix([
	[1, 0],
	[0, -1]
])

const identityMatrix: math.Matrix = math.matrix([
	[1, 0],
	[0, 1]
])

function getDeflectionMatrix(hitPoint: number, velocity: math.Matrix): math.Matrix {
	// Define the min and max angles of deflection in radians
	const minAngle = -(Math.PI / 180) * CONFIG.DEGREES; // -45 degrees
	const maxAngle = (Math.PI / 180) * CONFIG.DEGREES;  // 45 degrees
  
	// Calculate the actual angle based on the hitPoint value
	let angle = hitPoint * (maxAngle - minAngle) / 2;
	if (velocity.get([0, 0]) < 0) // TAG
		angle = -angle;
  
	// Create the deflection matrix using the calculated angle
	let deflectionMatrix: math.Matrix = math.matrix([
	  [- Math.cos(2 * angle), Math.sin(2 * angle)],
	  [Math.sin(2 * angle), Math.cos(2 * angle)]
	]);
  
	return deflectionMatrix;
}

// <independent of inital velocity>

	export function getNewVelocity(hitPoint: number, velocity: math.Matrix): math.Matrix {
		// Define the min and max angles of deflection in radians
		const minAngle = -(Math.PI / 180) * CONFIG.DEGREES; // -45 degrees
		const maxAngle = (Math.PI / 180) * CONFIG.DEGREES;  // 45 degrees

		// Calculate the actual angle based on the hitPoint value
		let angle = hitPoint * (maxAngle - minAngle) / 2;
		// if (velocity.get([0, 0]) < 0) // TAG
		// 	angle = -angle;

		// Calculate the new velocity vector using the calculated angle
		const speed = Math.sqrt(Math.pow(velocity.get([0, 0]), 2) + Math.pow(velocity.get([1, 0]), 2));
		let newVelocity: math.Matrix = math.matrix([
			[- speed * Math.cos(angle)],
			[speed * Math.sin(angle)]
		]);

		// Reverse the x direction if the ball was moving left
		if (velocity.get([0, 0]) < 0) {
			newVelocity.set([0, 0], -newVelocity.get([0, 0]));
		}

		return newVelocity;
	}

	export function deflection({velocity, paddle}: DeflectionParameters): math.Matrix {

		let newVelocity: math.Matrix = undefined;

		if (paddle)
		{
			newVelocity = getNewVelocity(paddle.hitPoint, velocity);
			if (newVelocity.get([0, 0]) < 0 && paddle.paddleNr === 1) // Second reflection
				return (velocity);
			if (newVelocity.get([0, 0]) > 0 && paddle.paddleNr === 2) // Second reflection
				return (velocity);
		}
		else
		{
			newVelocity = math.multiply(deflectionMatrixBorder, velocity);
		}

		if (!newVelocity)
			console.warn(`deflection failed`);
		
		newVelocity = increaseMagnitudeMatrix(newVelocity, (1 / CONFIG.BUMPS_TILL_MAX_SPEED));

		return (newVelocity);
	}

// </independent of inital velocity>

interface DeflectionParameters {
	velocity: math.Matrix;
	paddle?: {hitPoint: number, paddleNr: number};
}

export function getHitPoint(box1: math.Matrix, box2: math.Matrix): number {
	const dimensions: number [] = box1.size();
	const dimensions2: number [] = box2.size();

	if (dimensions[1] !== 2 || dimensions2[1] !== 2) // not 'boxes'
	{
		console.warn('Argument out of range')
	}

	if (dimensions[0] !== dimensions2[0] || dimensions[0] < 2) // 'boxes' of different dimenstions or not 2d boxes
	{
		console.warn('Argument out of range')
	}
	
	for (let i = 0; i < dimensions[0]; ++i)
	{
		const box1Min = box1.get([i, 0]);
		const box1Max = box1.get([i, 1]);
		const box2Min = box2.get([i, 0]);
		const box2Max = box2.get([i, 1]);

		if (box1Max < box2Min || box2Max < box1Min) {
			return undefined;
		}
	}

	const possibiltySpace = box2.get([1, 1]) - box2.get([1, 0]) + box1.get([1, 1]) - box1.get([1, 0]);
	const normed = ((box1.get([1, 1]) - box2.get([1, 0])) / possibiltySpace) * 2 - 1;
	return normed;
}
