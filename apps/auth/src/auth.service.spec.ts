import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; // Importação do bcrypt
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

// Mocking AuthRepository and JwtService
const mockAuthRepository = {
  teste: jest.fn(),
  createUser: jest.fn(),
  findUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

// Mock do módulo bcrypt completo
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService); // Obtenção direta do serviço a ser testado
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('teste()', () => {
    it('should call teste() on AuthRepository', async () => {
      mockAuthRepository.teste.mockResolvedValueOnce('mocked response');
      const result = await authService.teste();
      expect(mockAuthRepository.teste).toHaveBeenCalled();
      expect(result).toBe('mocked response');
    });
  });

  describe('register()', () => {
    it('should hash the password and create a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'example',
      };
      const hashedPassword = 'hashedPassword';
      const createUserResponse = { id: '1', ...registerDto };

      // Mock bcrypt.hash
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword); // Mock da função hash
      mockAuthRepository.createUser.mockResolvedValue(createUserResponse);

      const result = await authService.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('login()', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      mockAuthRepository.findUser.mockResolvedValue(null); // Simula que o usuário não foi encontrado

      await expect(authService.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongPassword' };
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockAuthRepository.findUser.mockResolvedValue(user); // Usuário encontrado

      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Senha incorreta

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user and token if login is successful', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'example',
      };
      process.env.JWT_EXPIRES_IN = '1d';

      mockAuthRepository.findUser.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Senha correta
      mockJwtService.sign.mockReturnValue('accessToken'); // Retorna o token mockado

      const result = await authService.login(loginDto);

      expect(mockAuthRepository.findUser).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: user.id });
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        accessToken: 'accessToken',
        accessTokenExpiresAt: expect.any(String),
      });
    });
  });

  describe('createToken()', () => {
    it('should create a valid JWT token', async () => {
      const userId = '1';
      process.env.JWT_EXPIRES_IN = '1d'; // Configuração de expiração

      mockJwtService.sign.mockReturnValue('accessToken'); // Mock do JWT

      const result = await authService.createToken(userId);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: userId });
      expect(result).toEqual({
        accessToken: 'accessToken',
        accessTokenExpiresAt: expect.any(String),
      });
    });
  });
});
