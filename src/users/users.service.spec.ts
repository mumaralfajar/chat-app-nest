import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseConfigService } from 'src/config/mongoose.config-service';
import { ConfigModule } from '@nestjs/config';
import mongodbConfig from 'src/config/mongodb.config';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let module: TestingModule;
  let service: UsersService;
  let userModel: Model<User>;
  let user: User;

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
    userModel = service.userModel;

    const [_user] = await Promise.all([
      new userModel({
        name: 'Unit Test ' + new Date().getTime(),
      }).save(),
    ]);

    user = _user;

    // console.log({ user });
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

  describe('findOneById', () => {
    it('should be defined', () => {
      expect(service.findOneById).toBeDefined();
    });

    it('should find a user by objectId', async () => {
      const id = user._id;
      const foundUser = await service.findOneById(id);
      expect(foundUser).toBeDefined();
      expect(foundUser._id).toEqual(id);
    });

    it('should find a user by string id', async () => {
      const id = user._id;
      const foundUser = await service.findOneById(id.toString());
      expect(foundUser).toBeDefined();
      expect(foundUser._id).toEqual(id);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(service.findOne).toBeDefined();
    });

    it('should find a user by name', async () => {
      const name = user.name;
      const foundUser = await service.findOne({ name });

      // console.log({ foundUser });

      expect(foundUser).toBeDefined();
      expect(foundUser.name).toEqual(name);
    });

    it('should not find a user', async () => {
      const name = 'sljdf lksdjflksdj' + new Date().getTime();
      const foundUser = await service.findOne({ name });

      expect(foundUser).toBeNull();
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
