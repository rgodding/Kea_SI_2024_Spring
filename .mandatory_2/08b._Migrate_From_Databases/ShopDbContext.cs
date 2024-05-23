using AutoMapper;
using main_service.Models.DomainModels;
using main_service.Models.DomainModels.ProductDomainModels;
using main_service.Models.DtoModels;
using main_service.RabbitMQ;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace main_service.Models;

public class ShopDbContext : DbContext
{
    

    public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
    {
    }
    
    public class ShopDbContextFactory : IDesignTimeDbContextFactory<ShopDbContext>
    {
        public ShopDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ShopDbContext>();
            optionsBuilder.UseMySql("server=main-service-db;user=user;password=userpass;database=mainservicedb",
                new MySqlServerVersion(new Version(8, 0, 29)));
            return new ShopDbContext(optionsBuilder.Options);
        }
    }

    public DbSet<UserDetails> UserDetails { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;
    public DbSet<Image> Images { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        // Products & Categories Relation (Many to Many)
        modelBuilder.Entity<Product>()
            .HasMany(p => p.Categories)
            .WithMany(c => c.Products);
        
        // Product & ProductDescription Relation (One to Many)
        modelBuilder.Entity<Product>()
            .HasMany(p => p.ProductDescriptions)
            .WithOne(pd => pd.Product)
            .HasForeignKey(pd => pd.ProductId);
        
        // Product & ProductRemoved Relation (One to One)
        modelBuilder.Entity<Product>()
            .HasOne(p => p.ProductRemoved)
            .WithOne(pr => pr.Product)
            .HasForeignKey<ProductRemoved>(pr => pr.ProductId);
        
        // Order & OrderItem Relation (One to Many)
        modelBuilder.Entity<Order>()
            .HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId);
        
        // OrderItem & Product Relation (Many to One)
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId);
        
        // User & Order Relation (One to Many)
        modelBuilder.Entity<UserDetails>()
            .HasMany(u => u.Orders)
            .WithOne(o => o.UserDetails)
            .HasForeignKey(o => o.UserId);
        
        // Image & Product Relation (One to Many)
        modelBuilder.Entity<Product>()
            .HasMany(p => p.Images)
            .WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId);
        modelBuilder.Entity<Image>()
            .HasOne(i => i.Product)
            .WithMany(p => p.Images)
            .HasForeignKey(i => i.ProductId);
        
        // Order
        modelBuilder.Entity<Order>()
            .HasIndex(e => e.OrderNumber)
            .IsUnique();
    }

    /// <summary>
    /// Create a method to seed data into the database
    /// </summary>
    public void SeedData()
    {
        if (!Products.Any())
        {
            var productList = new List<Product>{};
            for (var i = 0; i < 100; i++)
            {
                var product = new Product
                {
                    Guid = Guid.NewGuid(),
                    Stock = 100,
                    Sold = 0,
                };
                var productDescription = new ProductDescription
                {
                    Name = $"Product #{i}",
                    Description = $"Description for product #{i}",
                    Price = 100
                };
                product.ProductDescriptions.Add(productDescription);
                productList.Add(product);
            }
            Products.AddRange(productList);
            SaveChanges();
        }
        if (!Categories.Any())
        {
            var categoryList = new List<Category>{};
            for (var i = 0; i < 10; i++)
            {
                var category = new Category
                {
                    Name = $"Category #{i}",
                    Description = $"Description for category #{i}"
                };
                categoryList.Add(category);
            }
            Categories.AddRange(categoryList);
            SaveChanges();
        }
    }

    /// <summary>
    /// Migrate from SQL Server to MongoDB
    /// We will be using the Product model as an example, but this can be applied to any model
    /// This can either be a method in the DbContext or a separate service
    /// </summary>
    public async Task MigrateToMongoDb()
    {
        // SQL Server context
        await using var sqlContext = new ShopDbContext(new DbContextOptionsBuilder<ShopDbContext>()
            .UseMySql("mysql-connection-string")
            .Options);

        // MongoDB client and database
        var mongoClient = new MongoClient("mongodb-connection-string");
        var mongoDatabase = mongoClient.GetDatabase("mongodb-database-name");
        var mongoCollection = mongoDatabase.GetCollection<ProductMongoEntity>("products");

        // Fetch data from SQL Server
        var sqlData = await sqlContext.Products.ToListAsync();

        // Transform data into DTOs, since that is what we will be using
        var productDtos = sqlData.Select(p => _mapper.Map<ProductDto>(p)).ToList();
        
        // Transform and insert data into MongoDB
        var mongoData = productDtos.Select(p => new ProductMongoEntity
        {
            Id = p.Id,
            Guid = p.Guid,
            Name = p.Name,
            Description = p.Description

        }).ToList();
        
        await mongoCollection.InsertManyAsync(mongoData);
        Console.WriteLine("Data migration completed successfully.");
    }

    /// <summary>
    /// This model is used to represent how the data will be stored in MongoDB
    /// </summary>
    public class ProductMongoEntity
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }


}