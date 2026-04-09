import { Injectable } from '@nestjs/common';
import { CoreService } from '../../common/services/core.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends CoreService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  // Tambahkan business logic spesifik user di sini
}
