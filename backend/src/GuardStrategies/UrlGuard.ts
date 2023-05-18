import { CanActivate, ExecutionContext, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class ExistsGuardid implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
	const response = context.switchToHttp().getResponse();
	
	if (!request.params.id)
		return true;

    const id = Number(request.params.id);
    
	if (isNaN(id))
		return false;

    const userBool = await this.userService.userExists(id);
    
    return userBool;
  }
}

@Injectable()
export class ExistsGuardintra_id implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
	const response = context.switchToHttp().getResponse();
	
	if (!request.params.intra_id)
		return true;

    const intra_id = Number(request.params.intra_id);
    
	if (isNaN(intra_id))
		throw new HttpException(response, 400);

    const userBool = await this.userService.userExists(intra_id);
    
    return userBool;
  }
}
