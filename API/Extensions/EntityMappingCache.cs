using System;
using Microsoft.Extensions.Caching.Memory;
using System.Linq;

public class EntityMappingCache
{
    private readonly IMemoryCache _cache;
    private readonly StoreContext _context;

    private const string ProducerCacheKeyPrefix = "ProducerCache_";
    private const string ProductTypeCacheKeyPrefix = "ProductTypeCache_";

    public EntityMappingCache(IMemoryCache memoryCache, StoreContext context)
    {
        _cache = memoryCache;
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
}