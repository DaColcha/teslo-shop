import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(

        
        @InjectRepository(User)
        private readonly userRepository: Repository<User>

    ){
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate( payload: JwtPayload ): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOne({ where: { id } });
        
        if(!user) throw new UnauthorizedException("Token not valid");

        if( !user.isActive ) throw new UnauthorizedException("User is not active");
        
        return user;

    }
}