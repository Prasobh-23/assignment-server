import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService, // Inject ConfigService
    ) {
        super({
            clientID: configService.get<string>('CLIENT_ID'),
            clientSecret: configService.get<string>('CLIENT_SECRET'),
            callbackURL: 'http://localhost:3000/users/google/callback',
            passReqToCallback: true,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            const user = await this.authService.googleLogin(profile);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
}
