import { Test, TestingModule } from '@nestjs/testing';
import { SocketSessionService } from './socket-session.service';

describe('SocketSessionService', () => {
  let service: SocketSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketSessionService],
    }).compile();

    service = module.get<SocketSessionService>(SocketSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
