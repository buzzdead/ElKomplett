using API.Entities.ConfigAggregate;
using API.Services;

public class ProductService
{
    private readonly ImageService _imageService;
    private readonly StoreContext _context;
    private readonly EntityMappingCache _mappingCache;

    public ProductService(ImageService imageService, StoreContext context, EntityMappingCache mappingCache)
    {
        _imageService = imageService;
        _context = context;
        _mappingCache = mappingCache;
    }

    public async Task DeleteImages(IEnumerable<ImageDto> images)
        {
            foreach (ImageDto image in images)
            {
                if (!string.IsNullOrEmpty(image.PublicId) && image.PublicId != "0")
                    await _imageService.DeleteImageAsync(image.PublicId);
            }
        }

        public void RemoveConfigurations(Product product)
        {
            foreach(Config config in product.Configurables.ToList()) 
            {
                DeleteImages(config.Images.ToList()).Wait();
                product.RemoveConfig(config);
                _context.Config.Remove(config);
            }
        }
        public async Task RemoveProducer(string name)
        {
            var producerId = _mappingCache.GetProducerIdFromName(name);
            var myProducts = _context.Products.Where(p => p.Producer.Id == producerId);
            await myProducts.ForEachAsync(p => p.Producer = null);
            var producer = await _context.Producers.FindAsync(producerId);
            _context.Producers.Remove(producer);
        }

        public async Task RemoveProductType(string name)
        {
            var productTypeId = _mappingCache.GetProductTypeIdFromName(name);
            var myProducts = _context.Products.Where(p => p.ProductType.Id == productTypeId);
            await myProducts.ForEachAsync(p => p.ProductType = null);
            var productType = await _context.ProductTypes.FindAsync(productTypeId);
            _context.ProductTypes.Remove(productType);
        }
        public async Task<Product> GetProductWithRelations(int id)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Producer)
                .Include(p => p.ProductType)
                .Include(p => p.Configurables)
                .ThenInclude(c => c.Images)
                .FirstOrDefaultAsync(p => p.Id == id);
            return product;
        }
}