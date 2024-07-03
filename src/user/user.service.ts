import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Constants } from 'src/utils/constants';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    try {
      const user: User = new User();
      user.email = createUserDto.email;
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.password = createUserDto.password;
      user.role = Constants.ROLES.NORMAL_ROLE;
      return this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(
        `User not created.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findUserById(id: number) {
    try {
      return await this.userRepository.findOneOrFail({ where: { id: id } });
    } catch (err) {
      console.log('Get User by id error: ', err.message ?? err);
      throw new HttpException(
        `User with id: ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAll() {
    const userData = await this.userRepository.find();
    if (!userData || userData.length == 0) {
      throw new NotFoundException('User data not found!');
    }
    return userData;
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { email: email } });
    } catch (err) {
      console.log('Get User by email error: ', err.message ?? err);
      throw new HttpException(
        `User with email: ${email} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }


  remove(id: number) {
    return this.userRepository.delete(id);
  }

}
