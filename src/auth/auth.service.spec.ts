import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { generateTestPassword } from '../utils/test-helpers';

describe('AuthService', () => {
  let module: TestingModule;
  let authService: AuthService;
  let usersService: UsersService;
  let userModel: Model<User>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [
        AuthService,
        UsersService,
        JwtService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and return a JWT', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: generateTestPassword(),
      };

      const result = await authService.register(createUserDto);

      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();
      const savedUser = await usersService.findByEmail(createUserDto.email);
      expect(savedUser).toBeDefined();
      expect(savedUser.email).toEqual(createUserDto.email);
    });
  });

  describe('login', () => {
    it('should validate user credentials and return a JWT', async () => {
      const loginUserDto = { email: 'johndoe@example.com', password: generateTestPassword() };

      const result = await authService.login(loginUserDto);

      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
