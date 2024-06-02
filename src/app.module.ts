import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MorganMiddleware } from './middlewares/morgan.middleware';
import { BlogsModule } from './blogs/blogs.module';
import { JWTMiddleware } from './middlewares/jwt.middleware';
import { CookieMiddleware } from './middlewares/cookie.middleware';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, BlogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieMiddleware)
      .forRoutes('*');
      
    consumer
      .apply(JWTMiddleware)
      .exclude(
        { path: 'users/registerUser', method: RequestMethod.POST },
        { path: 'users/loginUser', method: RequestMethod.POST },
      )
      .forRoutes('*');

    consumer
      .apply(MorganMiddleware)
      .forRoutes('*');

    
  }
}

