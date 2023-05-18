import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    switch (host.getType()) {
      case 'http':
        this.handleHttpException(exception, host.switchToHttp());
        break;
      case 'ws':
        this.handleWsException(exception, host.switchToWs());
        break;
      default:
		// Log the exception for debugging purposes
		console.error('Unhandled Exception', exception);
		break;
    }
  }

  private handleHttpException(exception: unknown, host: HttpArgumentsHost) {
    const ctx = host;
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private handleWsException(exception: unknown, host: WsArgumentsHost) {
    const client = host.getClient();
    // Here you can handle the exception as you want for the websocket context
    // For instance, send a message to the client
    client.emit('exception', { 
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR, 
      timestamp: new Date().toISOString(),
      message: 'An error occurred' 
    });
  }

}
