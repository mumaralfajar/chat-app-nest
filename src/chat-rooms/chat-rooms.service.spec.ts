import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoomsService } from './chat-rooms.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from 'src/schemas/chat-room.schema';
import { TestModule } from 'src/test.module';
import { Model } from 'mongoose';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

describe('ChatRoomsService', () => {
  let module: TestingModule;
  let service: ChatRoomsService;
  let chatRoomModel: Model<ChatRoom>;
  let chatRoom: ChatRoom;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TestModule,
        MongooseModule.forFeature([
          {
            name: ChatRoom.name,
            schema: ChatRoomSchema,
          },
        ]),
      ],
      providers: [ChatRoomsService],
    }).compile();

    service = module.get<ChatRoomsService>(ChatRoomsService);
    chatRoomModel = module.get<Model<ChatRoom>>(getModelToken(ChatRoom.name));

    const [_chatRoom] = await Promise.all([
      new chatRoomModel({
        name: 'Chat Room Test ' + new Date().getTime(),
      }).save(),
    ]);

    chatRoom = _chatRoom;

    // console.log({ chatRoom });
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
      expect.objectContaining({
        ...chatRoom,
      });
    });

    it('should find a chat room by string id', async () => {
      const id = chatRoom._id;
      const result = await service.findOneById(id.toString());

      // console.log({ result });

      expect(result).toBeDefined();
      expect(result._id).toEqual(id);
      expect.objectContaining({
        ...chatRoom,
      });
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

      /**
       * @see https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98
       */
      expect.arrayContaining([
        expect.objectContaining({
          ...chatRoom,
        }),
      ]);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
