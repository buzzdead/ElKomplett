using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }

        public string BuyerId { get; set; }

        public List<BasketItem> Items { get; set; } = new();
        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }

        public void AddItem(Product product, int quantity, int configId) 
        {
            if (Items.All(item => item.ProductId != product.Id))
            {
                Items.Add(new BasketItem{Product = product, Quantity = quantity, ConfigId = configId});
            }

            else {
            var existingItems = Items.Where(item => item.ProductId == product.Id).ToList();
            if(configId > 0) {
                if(existingItems.All(eI => eI.ConfigId != configId)){
                   Items.Add(new BasketItem{Product = product, Quantity = quantity, ConfigId = configId});
                    
                   }
                 else 
                 {
                 var EI = existingItems.Find(eI => eI.ConfigId == configId);
                 EI.Quantity += quantity;
                 }
            }
            else existingItems[0].Quantity += quantity;

            }
        }

        public void RemoveItem(int productId, int quantity, int configId) 
        {
            var item = configId > 0 ? Items.FirstOrDefault(item => item.ProductId == productId && item.ConfigId == configId) : Items.FirstOrDefault(item => item.ProductId == productId);
            if (item == null) return;
            item.Quantity -= quantity;
            if(item.Quantity <= 0) Items.Remove(item);
        }

    }
}