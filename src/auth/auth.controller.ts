import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../generics/decorators/public-decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AtualizarPushTokenDto } from './dto/atualizar-push-token.dto';
import { RegistrarVendedorDto } from './dto/registrar-vendedor.dto';
import { VendedorRegistradoRes } from './types/vendedor.types';
import { UserRequest } from '../generics/decorators/user-in-request.decorator';
import { UsuariosEntity } from '../entities/usuarios.entity';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Api de teste no auth' })
  @Public()
  @Get('teste')
  teste(): Promise<{ status: string }> {
    return this.authService.teste();
  }

  @ApiOperation({ summary: 'Registrar usuário' })
  @Public()
  @Post('register')
  @HttpCode(201)
  register(@Body() body: RegisterDto): Promise<{
    userId: string;
    accessToken: string;
    accessTokenExpiresAt: string;
  }> {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: 'Registrar vendedor' })
  @ApiOkResponse({ type: VendedorRegistradoRes })
  @Public()
  @Post('register/vendedor')
  @HttpCode(201)
  registrarVendedor(
    @Body() body: RegistrarVendedorDto,
  ): Promise<VendedorRegistradoRes> {
    return this.authService.registerVendedor(body);
  }

  @ApiOperation({ summary: 'Login' })
  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto): Promise<{
    userId: string;
    accessToken: string;
    accessTokenExpiresAt: string;
  }> {
    return this.authService.login(body);
  }

  @ApiOperation({ summary: 'Esqueci minha senha' })
  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<{
    telefone: string;
    token: string;
  }> {
    return this.authService.forgotPassword(body);
  }

  @ApiOperation({ summary: 'Atualizar push token do usuário' })
  @ApiBearerAuth()
  @Post('push-token')
  @HttpCode(200)
  atualizarPushToken(
    @Body() body: AtualizarPushTokenDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<{ message: string }> {
    return this.authService.atualizarPushToken(user.id, body.pushToken);
  }
}
