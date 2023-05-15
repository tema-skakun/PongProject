import { ClassConstructor,
	instanceToPlain,
	plainToInstance } from 'class-transformer';

export function ObjectPruning<T>(prunningType: ClassConstructor<T>, inst: Record<string, any>) {
	return plainToInstance(prunningType, instanceToPlain(inst), {excludeExtraneousValues: true});
}

export function ObjectPruningMany<T>(prunningType: ClassConstructor<T>, instances: Record<string, any> [])
{
	const pruned: T[] = [];
	for (const inst of instances)
		pruned.push(ObjectPruning(prunningType, inst));
	
	return pruned;
}
