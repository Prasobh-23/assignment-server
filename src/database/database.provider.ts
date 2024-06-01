import { MongoClient, Db } from 'mongodb';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const DatabaseProvider: Provider = {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService): Promise<Db> => {
        const mongoUri = configService.get<string>('MONGODB_URI');
        const client = new MongoClient(mongoUri);
        await client.connect();
        return client.db(configService.get<string>('DATABASE_NAME'));
    },
    inject: [ConfigService],

};