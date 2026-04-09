import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreRepository } from '../common/repositories/core.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends CoreRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // Tambahkan metode spesifik user di sini (misal: findByEmail)
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
