import { Injectable } from "@nestjs/common";

@Injectable()
export class LB<T> { // Link Back, look in docs!
	public maps: Map<any, T> [] = [];

	initalize(numberOfProperties: number ) {
		for (let cnt: number = 0; cnt < numberOfProperties; ++cnt) {
			this.maps.push(new Map<any, T>());
		}
	}

	link(objectsToLinkBack: any [], linkTo: T) { // Either make a closure or use the right object right away... Neither because a new object is instantiated.
		let cnt: number = 0;
		for (const object of objectsToLinkBack) {
			this.maps[cnt].set(object, linkTo);
			++cnt;
		}
	}

	retrieveMap(index: number): Map<any, T> {
		return (this.maps[index]);
	}
}