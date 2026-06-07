using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Stock;
using api.Models;

namespace api.Mappers
{
    public static class StockMappers
    {
        public static StockDto ToStockDto(this Stock stockModel)
        {
            return new StockDto
            {
                Id = stockModel.Id,
                Symbol = stockModel.Symbol,
                CompanyName = stockModel.CompanyName,
                Purchase = stockModel.Purchase,
                LastDiv = stockModel.LastDiv,
                Industry = stockModel.Industry,
                MarketCap = stockModel.MarketCap,
                Comments = stockModel.Comments.Select(c => c.ToCommentDto()).ToList()
            };
        }

        public static Stock ToStockFromCreateDTO(this CreateStockRequestDto stockDto)
        {
            return new Stock
            {
                Symbol = stockDto.Symbol,
                CompanyName = stockDto.CompanyName,
                Purchase = stockDto.Purchase,
                LastDiv = stockDto.LastDiv,
                Industry = stockDto.Industry,
                MarketCap = stockDto.MarketCap
            };
        }

        public static Stock ToStockFromFinnhub(this FinnhubProfile profile, FinnhubQuote? quote)
        {
            var marketCap = profile.MarketCapitalization > 0
                ? (long)(profile.MarketCapitalization * 1_000_000)
                : 0;

            return new Stock
            {
                Symbol = profile.Ticker ?? string.Empty,
                CompanyName = profile.Name ?? string.Empty,
                Purchase = quote?.C ?? 0,
                LastDiv = 0,
                Industry = profile.FinnhubIndustry ?? string.Empty,
                MarketCap = marketCap
            };
        }
    }
}
