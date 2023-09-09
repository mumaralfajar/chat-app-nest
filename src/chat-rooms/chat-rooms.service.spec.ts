import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomsService } from './chat-rooms.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from 'src/schemas/chat-room.schema';
import { TestModule } from 'src/test.module';
import { Model } from 'mongoose';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { User, UserSchema } from 'src/schemas/user.schema';

describe('ChatRoomsService', () => {
  let module: TestingModule;
  let service: ChatRoomsService;
  let chatRoomModel: Model<ChatRoom>;
  let chatRoom: ChatRoom;
  let userModel: Model<User>;
  let user: User;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TestModule,
        MongooseModule.forFeature([
          {
            name: ChatRoom.name,
            schema: ChatRoomSchema,
          },
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [ChatRoomsService],
    }).compile();

    service = module.get<ChatRoomsService>(ChatRoomsService);
    chatRoomModel = module.get<Model<ChatRoom>>(getModelToken(ChatRoom.name));
    userModel = module.get<Model<User>>(getModelToken(User.name));

    const [_chatRoom, _user] = await Promise.all([
      new chatRoomModel({
        name: 'Chat Room Test ' + new Date().getTime(),
      }).save(),
      new userModel({
        name: 'User Test ' + new Date().getTime(),
      }).save(),
    ]);

    chatRoom = _chatRoom;
    user = _user;

    // console.log({ chatRoom, user });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should create a chat room', async () => {
      const dto = new CreateChatRoomDto();
      dto.name = 'Chat Room Test ' + new Date().getTime();
      const result = await service.create(dto);

      // console.log({ result });

      expect(result).toBeDefined();
      expect(result.name).toEqual(dto.name);
    });
  });

  describe('findOneById', () => {
    it('should be defined', () => {
      expect(service.findOneById).toBeDefined();
    });

    it('should find a chat room by object id', async () => {
      const id = chatRoom._id;
      const result = await service.findOneById(id);

      // console.log({ result });

      expect(result).toBeDefined();
      expect(result._id).toEqual(id);
    });

    it('should find a chat room by string id', async () => {
      const id = chatRoom._id;
      const result = await service.findOneById(id.toString());

      // console.log({ result });

      expect(result).toBeDefined();
      expect(result._id).toEqual(id);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });

    it('should find all chat rooms', async () => {
      const result = await service.findAll();

      // console.log({ result });

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: chatRoom._id,
          }),
        ]),
      );
    });
  });

  describe('addParticipantToChatRoom', () => {
    it('should be defined', () => {
      expect(service.addParticipantToChatRoom).toBeDefined();
    });

    it('should add participant to a chat room', async () => {
      const chatRoomId = chatRoom._id;
      const userId = user._id;
      const result = await service.addParticipantToChatRoom({
        chatRoomId,
        userId,
      });

      expect(result).toBeDefined();

      const updatedChatRoom: ChatRoom = await chatRoomModel.findById(chatRoomId);

      // console.dir({ updatedChatRoom }, { depth: null });

      expect(updatedChatRoom.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: userId,
          }),
        ]),
      );
    });
  });

  describe('isUserParticipatedInChatRoom', () => {
    it('should be defined', () => {
      expect(service.isUserParticipatedInChatRoom).toBeDefined();
    });

    it('should return true', async () => {
      const userId = user._id;
      const chatRoom = await new chatRoomModel({
        name: 'Chat Room Test ' + new Date().getTime(),
        participants: [userId],
      }).save();

      const chatRoomId = chatRoom._id;

      const result = await service.isUserParticipatedInChatRoom({
        chatRoomId,
        userId,
      });

      expect(result).toBe(true);
    });

    it('should return false', async () => {
      const userId = user._id;
      const chatRoom = await new chatRoomModel({
        name: 'Chat Room Test ' + new Date().getTime(),
      }).save();

      const chatRoomId = chatRoom._id;

      const result = await service.isUserParticipatedInChatRoom({
        chatRoomId,
        userId,
      });

      expect(result).toBe(false);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
