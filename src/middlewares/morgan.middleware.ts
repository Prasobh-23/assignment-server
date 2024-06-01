import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        morgan(':method :url :status :res[content-length] - :response-time ms')(req, res, next);
    }
}