import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb+srv://admin:admin@cluster0.nxcyn.mongodb.net/doan?retryWrites=true&w=majority',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
})
export class MongoDBModule implements OnModuleInit {
  async onModuleInit() {
    try {
      await MongooseModule.forRootAsync({
        useFactory: async () => ({
          uri: 'mongodb+srv://admin:admin@cluster0.nxcyn.mongodb.net/doan?retryWrites=true&w=majority',
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
      });
      console.log('Connected to MongoDB successfully.');
    } catch (error) {
      console.error('Failed to connect to MongoDB.');
    }
  }
}
