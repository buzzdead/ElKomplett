

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {

            if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            query = orderBy switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)
            };
            return query;
        }
        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;
            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string producers, string productTypes, int categoryId, EntityMappingCache mappingCache)
        {
            var cId = categoryId != 0;
            if (categoryId != 0) query = query.Where(p => p.categoryId == categoryId);
            var (producerNames, productTypeNames) = mappingCache.GetProducersAndProductTypes(categoryId);
            if (!string.IsNullOrEmpty(producers))
            {
                var producerNameList = cId ? producers.Split(",").Where(producerNames.Contains).ToList() : producers.Split(",").ToList();
                var producerIds = producerNameList.Select(mappingCache.GetProducerIdFromName).ToList();
                query = query.Where(p => producerNameList.Count == 0 || producerIds.Contains(p.Producer.Id));
            }

            if (!string.IsNullOrEmpty(productTypes))
            {
                var productTypeList = cId ? productTypes.Split(",").Where(productTypeNames.Contains).ToList() : productTypes.Split(",").ToList();
                var productTypeIds = productTypeList.Select(mappingCache.GetProductTypeIdFromName).ToList();
                query = query.Where(p => productTypeList.Count == 0 || productTypeIds.Contains(p.ProductType.Id));
            }
            return query;
        }
    }

}