export const CoinGeckoConfig = {
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    'x-cg-api-key': 'CG-qkmTY8PweayDmjSTnx5GGa6B',
    accept: 'application/json',
  },
  top10CoinsParams: {
    vs_currency: 'usd',
    category: 'layer-1',
    order: 'market_cap_desc',
    per_page: 10,
    page: 1,
  },
  simplePriceParams: {
    ids: 'solana',
    vs_currencies: 'usd',
    include_market_cap: 'false',
    include_24hr_vol: 'false',
    include_24hr_change: 'false',
    include_last_updated_at: 'false',
  },
  marketdataParams: {
    ids: 'bitcoin,solana',
    vs_currencies: 'usd',
    include_market_cap: true,
    include_24hr_vol: true,
    include_24hr_change: true,
    include_last_updated_at: true,
  },
};
