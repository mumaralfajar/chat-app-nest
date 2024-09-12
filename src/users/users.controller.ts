import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, NotFoundException, Param, UseGuards, Version } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { ObjectIdPipe } from '../utils/pipes/object-id.pipe';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get user by id',
  })
  @Version('1')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '64fcb26814862ce1d787958a',
  })
  @Get(':id')
  async findOne(@Param('id', ObjectIdPipe) id: string): Promise<UserDto> {
    const result = await this.usersService.findOneById(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return {
      id: result._id,
      name: result.name,
      email: result.email,
    };
  }
}