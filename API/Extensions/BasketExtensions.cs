using System.Linq;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapBasketToDto(this Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                PaymentIntentId = basket.PaymentIntentId,
                ClientSecret = basket.ClientSecret,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.Images[0].PictureUrl,
                    Producer = item.Product.Producer,
                    Quantity = item.Quantity,
                    ConfigId = item.ConfigId,
                    Configurables = item.Product.Configurables
                }).ToList()
            };
        }
        public static IQueryable<Basket> RetrieveBasketWithItems(this IQueryable<Basket> query, string buyerId)
        {
            return query
    .Include(i => i.Items)
        .ThenInclude(p => p.Product)
            .ThenInclude(pi => pi.Images)
    .Include(p => p.Items)
    .ThenInclude(p => p.Product)
    .ThenInclude(p => p.Configurables)
    .ThenInclude(p => p.Images)
    .Where(b => b.BuyerId == buyerId);

        }
    }
}