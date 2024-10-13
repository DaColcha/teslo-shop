import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService

  ) {}
  
  async create(createAuthDto: CreateUserDto) {

    try {
      
      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save(user);

      delete user.password;

      return {
        ...user,
        token: this.jwtToken({ id: user.id })
      };

    } catch (error) {
      
      this.handleDbError(error);

    }

  }

  async login( loginUserDto: LoginUserDto ){

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email }, 
      select: {email: true, password: true, id: true} 
     });

    if(!user) throw new BadRequestException('Invalid credentials (email)');

    if( !bcrypt.compareSync(password, user.password) )
      throw new BadRequestException('Invalid credentials (password)');

    //Usar JWT para como token de autenticación 
    return {
      ...user,
      token: this.jwtToken({ id: user.id })
    };
  }

  async checkAuthStatus( user: User ) { 
    return {
      ...user,
      token: this.jwtToken({ id: user.id })
    };
  }

  private jwtToken( payload: JwtPayload ): string {
    
    return this.jwtService.sign( payload );
  }

  private handleDbError( error: any ): never {
    
    if(error.code === '23505') 
      throw new BadRequestException(error.detail);
    
    throw new Error('Unexpected database error');
  }
}
