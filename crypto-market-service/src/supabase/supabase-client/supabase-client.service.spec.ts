import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseClientService } from './supabase-client.service';

describe('SupabaseClientService', () => {
  let service: SupabaseClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseClientService],
    }).compile();

    service = module.get<SupabaseClientService>(SupabaseClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
