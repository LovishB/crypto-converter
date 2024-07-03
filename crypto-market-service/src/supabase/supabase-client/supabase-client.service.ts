import { Injectable } from "@nestjs/common";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import config from "src/config/config";

@Injectable()
export class SupabaseClientService {
  /**
   * Initializes the SupabaseClientService with Supabase URL and API key.
   * Service for interacting with the Supabase database.
   */

  private supabase: SupabaseClient;

  constructor() {
    // Initialize Supabase client with provided URL and API key
    const { url, apiKey } = config.supabase;
    this.supabase = createClient(url, apiKey);
  }

  // Method to get the Supabase client instance
  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Read data from 'top-coins-fiat' table
  async readTableTopCoinsFiat() {
    console.log('Fetching data from "top-coins-fiat" table');
    const supabase = this.getClient();
    return (await supabase.from("top-coins-fiat").select("*")).data;
  }

  // Read data from 'market-data' table
  async readTableMarketData(coin: string) {
    console.log('Fetching data from "market-data" table');
    const supabase = this.getClient();
    return (
      await supabase
        .from("market-data")
        .select("*")
        .eq("crypto_name", coin)
        .order("created_date", { ascending: false })
    ).data; // Sort by created_date in desc
  }

  // Insert data into 'market-data' table
  async insertTableMarketData(formattedData) {
    const supabase = this.getClient();
    const { data, error } = await supabase
      .from("market-data")
      .insert(formattedData)
      .select();
  }
}
