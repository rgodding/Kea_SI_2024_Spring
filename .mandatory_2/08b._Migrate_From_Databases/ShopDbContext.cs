﻿using AutoMapper;
using main_service.Models.DomainModels;
using main_service.Models.DomainModels.ProductDomainModels;
using main_service.Models.DtoModels;
using main_service.RabbitMQ;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace main_service.Models;


/// <summary>
/// This is primarily based off the official documentation on microsoft
/// Link: https://learn.microsoft.com/en-us/ef/core/
/// TODO: This has not been implemented yet, but i have put down some of the ways to make things work
/// </summary>
public class ShopDbContext : DbContext
{
    

    public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
    {
    }
    
    /// <summary>
    /// From my understanding this was only needed during production
    /// It was necessary for when migration were being made
    /// TODO: So whether this should be pushed, or ignored im unsure of, maybe put into a separate class?
    /// </summary>
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

    // here will all the models be set, an example:
    // public DbSet<MODEL_NAME> MODEL_NAMES { get; set; } = null!;
    
    public DbSet<UserDetails> UserDetails { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;
    public DbSet<Image> Images { get; set; } = null!;
    
    /// <summary>
    /// This is used to create relations, indexes etc.
    /// This needs to be correct and documented since it will be applied unto database upon migration
    /// </summary>
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
        
        
        
        // Some examples
        /*
        - - To make one of the models value unique
        modelBuilder.Entity<User>()
            .HasIndex(e => e.Email)
            .IsUnique();
            
        - - Relations
        # ONE TO ONE
         modelBuilder.Entity<User>()
            .HasOne(e => e.Cart)
            .WithOne(e => e.User)
            .HasForeignKey<Cart>(e => e.UserId)
            .IsRequired();
        # MANY TO ONE
         modelBuilder.Entity<User>()
            .HasMany(e => e.Orders)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);
        # MANY TO MANY
        modelBuilder.Entity<Product>()
            .HasMany(e => e.Categories)
            .WithMany(e => e.Products);
            
        - - Ownership is also possible, if for example a user can have many addresses
        modelBuilder.Entity<User>()
            .OwnsMany(e => e.Addresses);
         */
        
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
}