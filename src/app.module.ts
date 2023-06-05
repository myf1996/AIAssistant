import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor } from 'nest-raven';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './apps/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db.config';
import { LoggerMiddleware } from './logger.middleware';
import { ChatModule } from './apps/chat/chat.module';
import { MessageModule } from './apps/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig()),
    UserModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
