import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders, RoleProtected, Auth } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginAuthDto: LoginUserDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testPrivateRoute(
    @Req() req: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() headers: string[]
  ) {
    return {
      ok: true, 
      user,
      userEmail,
      headers
    };
  }

  @Get('role-restrict')
  //@SetMetadata('roles', ['admin'])
  @RoleProtected( ValidRoles.ADMIN )
  @UseGuards( AuthGuard(), UserRoleGuard )
  testRoleRestrictedRoute(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user
    };
  }

  @Get('role-auth')
  @Auth( ValidRoles.GUEST )
  testRoleAuth(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      user
    };
  }
}
