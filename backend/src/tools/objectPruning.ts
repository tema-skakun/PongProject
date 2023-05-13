import { ClassConstructor,
	instanceToPlain,
	plainToInstance } from 'class-transformer';

export function ObjectPruning<T>(prunningType: ClassConstructor<T>, inst: Record<string, any>) {
	return plainToInstance(prunningType, instanceToPlain(inst), {excludeExtraneousValues: true});
}