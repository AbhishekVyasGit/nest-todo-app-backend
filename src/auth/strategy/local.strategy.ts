import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';
import { User } from '../../user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user: User = await this.userService.findUserByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}

