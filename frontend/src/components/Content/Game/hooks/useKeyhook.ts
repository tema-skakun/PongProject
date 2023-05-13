import { useEffect } from 'react';

export function useKeydown(handler: any ) {
useEffect(() => {
		document.addEventListener('keydown', handler)
		return (() => {
			document.removeEventListener('keydown', handler);
		})
	}, [handler])
}

