import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
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

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const { email, password, firstName, lastName } = createUserDto;
      const userExists = await this.userRepository.findOne({ where: { email } });
      if (userExists) {
        throw new ConflictException('Email already registered, please log in');
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: User = new User();
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = hashedPassword;
      user.role = Constants.ROLES.NORMAL_ROLE;
      const userProfile = await this.userRepository.save(user);
      const { password: _, ...result } = userProfile;
      return result;
    } catch (err) {
      throw new HttpException(
        err.message,
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

  async findAll(): Promise<User[]> {
    const userData = await this.userRepository.find();
    if (!userData || userData.length == 0) {
      throw new NotFoundException('User data not found!');
    }
    return userData;
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { email: email } });;
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
