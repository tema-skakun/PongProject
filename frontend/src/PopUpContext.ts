import { createContext } from "react";

export type PopUpContextArg = {
	displayBtn: boolean;
	// setDisplayBtn: (val: boolean) => any;

	invitedBy: string;
	// setInvitedBy: (val: string) => any;

	MyDecision: (decision: string) => void;

	displayPopUp: boolean;
	// setDisplayPopUp: (val: boolean) => any;

	// deactivatePopUp: Function;

	showRejection: boolean;
	// setShowRejection: (val: boolean) => any;
};

export const defaultPopUp: PopUpContextArg = {
	displayBtn: true,

	invitedBy: 'nobody',

	displayPopUp: false,
	// setDisplayPopUp: (val: boolean) ,

	MyDecision: (decision: string) => {console.log('Can not give feedback to inviter because callback missing')},

	showRejection: false,
}

export const PopUpContext = createContext<{val: PopUpContextArg, setter: React.Dispatch<React.SetStateAction<PopUpContextArg>> | undefined}>({val: defaultPopUp, setter: undefined})

export function changeProp<SUB extends Partial<SUP>, SUP extends Object>(setter:  React.Dispatch<React.SetStateAction<any>> | undefined, superset: SUP, prop: Record<string, any>)
{
	if (!setter)
		throw Error('setter has not been defined yet');

	setter(({...superset, ...prop} as unknown as SUB));
		
}

