import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async teste(): Promise<any> {
    return { status: 'ok' };
  }

  async createUser(data: Partial<User>) {
    return await this.userRepo.save(data);
  }

  async findUser(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async findUserById(id: string) {
    return await this.userRepo.findOneBy({ id });
  }
}
