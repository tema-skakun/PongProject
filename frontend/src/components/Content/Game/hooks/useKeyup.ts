import { useEffect } from 'react';

export function useKeyup(handler: any ) {
useEffect(() => {
		document.addEventListener('keyup', handler)
		return (() => {
			document.removeEventListener('keyup', handler);
		})
	}, [handler])
}
