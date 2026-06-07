using api.Dtos.Stock;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Newtonsoft.Json;

namespace api.Service
{
    public class FinnhubService : IFinnhubService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public FinnhubService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<Stock?> FindStockBySymbolAsync(string symbol)
        {
            try
            {
                var token = _config["FinnhubKey"];
                if (string.IsNullOrWhiteSpace(token))
                {
                    return null;
                }

                var profileTask = _httpClient.GetAsync($"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={token}");
                var quoteTask = _httpClient.GetAsync($"https://finnhub.io/api/v1/quote?symbol={symbol}&token={token}");

                await Task.WhenAll(profileTask, quoteTask);

                if (!profileTask.Result.IsSuccessStatusCode || !quoteTask.Result.IsSuccessStatusCode)
                {
                    return null;
                }

                var profileContent = await profileTask.Result.Content.ReadAsStringAsync();
                var quoteContent = await quoteTask.Result.Content.ReadAsStringAsync();

                var profile = JsonConvert.DeserializeObject<FinnhubProfile>(profileContent);
                var quote = JsonConvert.DeserializeObject<FinnhubQuote>(quoteContent);

                if (profile == null || string.IsNullOrWhiteSpace(profile.Ticker))
                {
                    return null;
                }

                return profile.ToStockFromFinnhub(quote);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }
        }
    }
}
