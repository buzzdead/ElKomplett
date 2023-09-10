using System;
using Microsoft.Extensions.Caching.Memory;
using System.Linq;

public class EntityMappingCache
{
    private readonly IMemoryCache _cache;
    private readonly IMemoryCache _categoryCache;
    private readonly StoreContext _context;

    private const string ProducerCacheKeyPrefix = "ProducerCache_";
    private const string ProductTypeCacheKeyPrefix = "ProductTypeCache_";

    public EntityMappingCache(IMemoryCache memoryCache, IMemoryCache categoryCache, StoreContext context)
    {
        _cache = memoryCache;
        _categoryCache = categoryCache;
        _context = context;
    }

    public int? GetProducerIdFromName(string name)
    {
        var cacheKey = ProducerCacheKeyPrefix + name;
        if (_cache.TryGetValue(cacheKey, out int? id))
        {
            return id;
        }

        id = _context.Producers.FirstOrDefault(p => p.Name == name)?.Id;
        if (id.HasValue)
        {
            _cache.Set(cacheKey, id, TimeSpan.FromMinutes(30));
        }

        return id;
    }

    public int? GetProductTypeIdFromName(string name)
    {
        var cacheKey = ProductTypeCacheKeyPrefix + name;
        if (_cache.TryGetValue(cacheKey, out int? id))
        {
            return id;
        }

        id = _context.ProductTypes.FirstOrDefault(p => p.Name == name)?.Id;
        if (id.HasValue)
        {
            _cache.Set(cacheKey, id, TimeSpan.FromMinutes(30));
        }

        return id;
    }

  public bool CategoriesIsEmpty()
{
    return !_categoryCache.TryGetValue(0, out Dictionary<string, int> categoryInfo);
}

    public void InitializeCategories()
    {
        var products = _context.Products.Include(p => p.Producer).Include(p => p.ProductType).ToList();

        foreach (var product in products)
        {
            int categoryId = product.categoryId;

            // If the category is not already in the cache, add it
            if (!_categoryCache.TryGetValue(categoryId, out Dictionary<string, int> categoryInfo))
            {
                categoryInfo = new Dictionary<string, int>();
                _categoryCache.Set(categoryId, categoryInfo);
            }

            AddOneToCategoryCache(product, categoryInfo);
        }
        if (!_categoryCache.TryGetValue(0, out Dictionary<string, int> dummyCategoryInfo))
    {
        dummyCategoryInfo = new Dictionary<string, int>();
        _categoryCache.Set(0, dummyCategoryInfo);
    }
    }

    private static void AddOneToCategoryCache(Product product, Dictionary<string, int> categoryInfo, bool remove = false)
    {
        var value = remove ? -1 : 1;

        if (product.Producer != null)
        {
            string producerName = product.Producer.Name;
            
            if (categoryInfo.ContainsKey(producerName))
            {
                categoryInfo[producerName] += value;
            }
            else if (!remove)
            {
                categoryInfo[producerName] = 1;
            }
        }

        // Update product type count
        if (product.ProductType != null)
        {
            string productTypeName = product.ProductType.Name;
            if (categoryInfo.ContainsKey(productTypeName))
            {
                categoryInfo[productTypeName] += value;
            }
            else if (!remove)
            {
                categoryInfo[productTypeName] = 1;
            }
        }
    }

    public void ProductUpdate(int categoryId, Product product, bool remove = false)
    {
         if (!_categoryCache.TryGetValue(categoryId, out Dictionary<string, int> categoryInfo))
            {
                categoryInfo = new Dictionary<string, int>();
                _categoryCache.Set(categoryId, categoryInfo);
            }

        AddOneToCategoryCache(product, categoryInfo, remove);

    }

    public (List<string> ProducerNames, List<string> ProductTypeNames) GetProducersAndProductTypes(int categoryId)
{
    if (_categoryCache.TryGetValue(categoryId, out Dictionary<string, int> categoryInfo))
    {
        var abc = categoryInfo;
        List<string> producerNames = categoryInfo.Where(kv => kv.Value > 0).Select(kv => kv.Key).ToList();

        List<string> productTypeNames = categoryInfo.Where(kv => kv.Value > 0).Select(kv => kv.Key).ToList();

        return (producerNames, productTypeNames);
    }

    return (new List<string>(), new List<string>());
}

}