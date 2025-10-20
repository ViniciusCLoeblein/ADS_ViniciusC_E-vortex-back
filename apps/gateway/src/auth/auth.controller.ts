import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Public } from 'apps/generics/decorators/public-decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegistrarVendedorDto } from './dto/registrar-vendedor.dto';
import { VendedorRegistradoRes } from './types/vendedor.types';

@Controller('auth')
@ApiTags('Auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Api de teste no auth' })
  @Get('teste')
  teste(): Observable<{ status: string }> {
    return this.authService.teste();
  }

  @ApiOperation({ summary: 'Registrar usuário' })
  @Post('register')
  @HttpCode(201)
  register(@Body() body: RegisterDto): Observable<{
    userId: string;
    accessToken: string;
    accessTokenExpiresAt: string;
  }> {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: 'Registrar vendedor' })
  @ApiOkResponse({ type: VendedorRegistradoRes })
  @Post('register/vendedor')
  @HttpCode(201)
  registrarVendedor(
    @Body() body: RegistrarVendedorDto,
  ): Observable<VendedorRegistradoRes> {
    return this.authService.registrarVendedor(body);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto): Observable<{
    userId: string;
    accessToken: string;
    accessTokenExpiresAt: string;
  }> {
    return this.authService.login(body);
  }
}
