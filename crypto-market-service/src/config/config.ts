interface Config {
  supabase: {
    url: string;
    apiKey: string;
  };
  coingecko: {
    apiKey: string;
  };
}

const config: Config = {
  supabase: {
    url: process.env.SUPABASE_URL || "",
    apiKey: process.env.SUPABASE_API_KEY || "",
  },
  coingecko: {
    apiKey: process.env.COINGECKO_API_KEY || "",
  },
};

export default config;
