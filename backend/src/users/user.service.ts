import { Injectable } from '@nestjs/common';
import { CoreService } from '../common/services/core.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends CoreService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  // Tambahkan business logic spesifik user di sini
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
}
