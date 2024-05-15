import express from "express";

const app = express();

let productId = 2;
const products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
    { id: 4, name: "Product 4", price: 400 },
    { id: 5, name: "Product 5", price: 500 },
];

let categoryId = 2;
const categories = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
];

import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLNonNull } from "graphql";

const CategoryType = new GraphQLObjectType({
    name: "Category",
    description: "Category of products",
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        products: {
            type: new GraphQLList(ProductType),
            resolve: (category) => {
                return products.filter((product) => product.id === category.id);
            },
        },
    }),
});

const ProductType = new GraphQLObjectType({
    name: "Product",
    description: "Product of the store",
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        price: { type: GraphQLInt },
        categoryIds: { type: new GraphQLList(GraphQLInt) },
        categories: {
            type: new GraphQLList(CategoryType),
            description: "Categories of the product",
            resolve: (product) => {
                return categories.filter((category) => category.id === product.id);
            },
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: "RootMutationType",
    fields: {
        addProduct: {
            type: ProductType,
            description: "Add a product",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                price: { type: GraphQLNonNull(GraphQLInt) },
                categoryIds: { type: new GraphQLList(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const product = { 
                    id: productId++, 
                    name: args.name, 
                    price: args.price ,
                };
                
                products.push(product);
                return product;
            },
        },
        addCategory: {
            type: CategoryType,
            description: "Add a category",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const category = { 
                    id: categoryId++, 
                    name: args.name 
                };
                
                categories.push(category);
                return category;
            },
        },
    },
});

const RootQueryType = new GraphQLObjectType({
    name: "RootQueryType",
    description: "Root Query",
    fields: {
        products: {
            type: new GraphQLList(ProductType),
            description: "List of products",
            resolve: () => products,
        },
        categories: {
            type: new GraphQLList(CategoryType),
            description: "List of categories",
            resolve: () => categories,
        },
        productById: {
            type: ProductType,
            description: "A single product",
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) => {
                products.find((product) => product.id === args.id);
            },
        },
    },
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});

import { graphqlHTTP } from "express-graphql";
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true,
}));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});