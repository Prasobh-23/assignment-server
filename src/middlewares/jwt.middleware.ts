import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JWTMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) { }

    use(req: any, res: any, next: () => void) {

        const token = req.cookies.authToken;
        if (token) {
            jwt.verify(token, this.configService.get<string>('JWT_SECRET'), (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "Authorization Token is invalid",
                        data: [],
                        status: 401,
                    });
                } else {
                    req.user = decodedToken;
                    next();
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Authorization Token is required",
                data: [],
                status: 400,
            });
        }
    }
}
