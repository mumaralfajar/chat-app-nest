import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseConfigService } from 'src/config/mongoose.config-service';
import { ConfigModule } from '@nestjs/config';
import mongodbConfig from 'src/config/mongodb.config';

describe('UsersService', () => {
  let module: TestingModule;
  let service: UsersService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [mongodbConfig],
        }),
        MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        }),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should create a user', async () => {
      const dto = new CreateUserDto();
      dto.name = 'Unit Test ' + new Date().getTime();
      const user = await service.create(dto);

      // console.log({ user });

      expect(user).toBeDefined();
      expect(user.name).toEqual(dto.name);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
