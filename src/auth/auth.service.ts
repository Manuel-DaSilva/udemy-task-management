import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {

        return this.userRepository.signUp(authCredentialsDto);
    }

    async signin(authCredentialsDto: AuthCredentialsDto): Promise<UserResponseDto> {

        const user = await this.userRepository.validateUserPassword(authCredentialsDto);
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload: JwtPayload = { id: user.id };
        const accessToken = await this.jwtService.sign(payload);
        const userResponse = UserResponseDto.fromUser(user, accessToken);

        return userResponse;
    }
}
