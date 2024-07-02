import { Module } from '@nestjs/common';
import { SupabaseClientService } from './supabase-client/supabase-client.service';

@Module({
  providers: [SupabaseClientService],
  exports: [SupabaseClientService],
})
export class SupabaseModule {}
