using api.Models;

namespace api.Interfaces
{
    public interface IFinnhubService
    {
        Task<Stock?> FindStockBySymbolAsync(string symbol);
    }
}
