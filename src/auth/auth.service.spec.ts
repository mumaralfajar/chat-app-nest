import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { generateTestPassword } from '../utils/test-helpers';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userModel: Model<User>;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mockAccessToken'),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and return the user data', async () => {
      const createUserDto: RegisterDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: generateTestPassword(),
      };

      mockUserModel.create.mockReturnValue({
        ...createUserDto,
        _id: 'mockId',
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await authService.register(createUserDto);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toEqual(createUserDto.email);
    });
  });

  describe('login', () => {
    it('should validate user credentials and return a JWT', async () => {
      const loginUserDto = { email: 'johndoe@example.com', password: 'testpassword' };

      mockUserModel.findOne.mockReturnValue({
        _id: 'mockId',
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginUserDto);

      expect(result).toBeDefined();
      expect(result.access_token).toBe('mockAccessToken');
    });
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });
});
