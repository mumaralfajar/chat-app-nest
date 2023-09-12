import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { mongodbConfig } from './mongodb.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseConfigService.name);
  protected uri: string;

  constructor(
    @Inject(mongodbConfig.KEY)
    private readonly mongoConfig: ConfigType<typeof mongodbConfig>,
  ) {
    const mongodb = 'mongodb://';
    const host = this.mongoConfig.host;
    const port = this.mongoConfig.port;
    const user = this.mongoConfig.user;
    const password = this.mongoConfig.password;
    const database = this.mongoConfig.database;

    // console.log({ mongodb, host, port, user, password, database });

    if (user && password) {
      this.uri = `${mongodb}${user}:${password}@${host}:${port}/${database}`;
      return;
    }

    this.uri = `${mongodb}${host}:${port}/${database}`;
  }

  createMongooseOptions(): MongooseModuleOptions {
    this.logger.log(`uri: ${this.uri}`);

    return {
      uri: this.uri,
    };
  }
}
