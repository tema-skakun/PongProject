import { Injectable } from "@nestjs/common";

type SwitchFunction = (newState: boolean, client: string, props?: any) => void;

type RestrictionMap = Map<string, Map < string, {state: boolean, stateChange?: SwitchFunction} > >;
const restrictionMap: MapConstructor = Map<string, Map<string , {state: boolean, stateChange: Function}> >;

type NestedMap = Map < string , {state?: boolean, stateChange?: SwitchFunction} >;

@Injectable()
export class UserRestriction {
	// <PUT YOUR RESTRICTION NAMES HERE>
	static user_can_press_keys_in_game_canvas: string = "user_can_press_keys_in_game_canvas";
	// </PUT YOUR RESTRICTION NAMES HERE>
	
	private restrictions: RestrictionMap;
	private nested: NestedMap [];

	constructor() {
		this.nested = [];
		this.restrictions = new restrictionMap;

		for (const stuff in UserRestriction) // Setting all the actions
		{
			this.restrictions.set(stuff, new Map<undefined, undefined>);
		}
	}

	switch(on: boolean, userId: string, action: string, props: any = undefined) {
		if (!this.restrictions.has(action))
		{
			console.warn('Action does not exists');
		}
		else if (!this.restrictions.get(action).has(userId))
			{
				return ;
			}

		if (on === this.restrictions.get(action).get(userId).state)
		{
			return ;
		}

		if (!props)
			this.restrictions.get(action).get(userId).stateChange(on, userId); // Calling the switch function
		else
			this.restrictions.get(action).get(userId).stateChange(on, userId, props); // Calling the switch function
	}

	attachStateSwitch(userId: string, action: string, stateSwitch: SwitchFunction, initalState: boolean = true) {
		if (!this.restrictions.has(action))
		{
			console.warn('Action does not exist');
		}

		this.restrictions.set(action, this.restrictions.get(action).set(userId, {state: initalState, stateChange: stateSwitch}) )
	}

}
