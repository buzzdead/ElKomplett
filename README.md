# ReStore - Your One Stop Shop

ReStore is a webshop application that allows you to add, view, and purchase products with ease. With CRUD operations, you can add, edit, and delete products, as well as create configurations for each product.

This application is built with React, TypeScript, .NET, and C#. It is hosted on Heroku, so there is no need for installation or setup.

## Key Features

- CRUD operations for products
- Create configurations with a key and multiple values
- Create presets for compositions with multiple keys and values
- Each configuration has its own pictures, quantity, and price
- Browsable catalog page with pagination
- Add products to a basket
- Purchase products with a fake Stripe card

## Usage

To test the CRUD operations, you can create a test admin account by navigating to `/register` and entering the following details:

Email: admin@example.com
Password: MyPa$$w0rd

You can then log in to the inventory panel at `/inventory` to manage products and configurations.

To browse the catalog, simply navigate to `/catalog` and use the pagination links to view more products..

To purchase a product, add it to the basket and navigate to the checkout page. You can use the fake Stripe card details provided on the stripe testing site [Stripe Test](https://stripe.com/docs/testing) to complete the purchase.

## Contributing

If you would like to contribute to the project, please fork the repository and create a pull request with your changes..

## License

This project is licensed under the MIT License.
