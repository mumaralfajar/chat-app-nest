import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import mongodbConfig from './mongodb.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  protected uri: string;

  constructor(
    @Inject(mongodbConfig.KEY)
    private readonly mongoDBConfig: ConfigType<typeof mongodbConfig>,
  ) {
    const host = this.mongoDBConfig.host;
    const port = this.mongoDBConfig.port;
    const database = this.mongoDBConfig.database;

    // console.log({ host, port, database });

    this.uri = `mongodb://${host}:${port}/${database}`;
  }

  createMongooseOptions(): MongooseModuleOptions {
    // console.log({ uri: this.uri });

    return {
      uri: this.uri,
    };
  }
}
