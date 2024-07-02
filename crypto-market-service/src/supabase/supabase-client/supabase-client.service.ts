import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseClientService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://ucesrihbdbspemdwskex.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZXNyaWhiZGJzcGVtZHdza2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3NzIzODcsImV4cCI6MjAzNTM0ODM4N30.qzkGThgSX6Cqtu1zOaYIJrb8tlE9m-TjLylEyAiwskQ',
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
