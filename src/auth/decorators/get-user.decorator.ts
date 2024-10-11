import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

//Decorador de parámetro personalizado
export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {

        const request = ctx.switchToHttp().getRequest();

        const user = request.user;

        if (!user) throw new InternalServerErrorException("User not found (request)");

        if(data) return user[data];
        
        return user;
        
    }
);