const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
let products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

let discount = (n, d) => {
  let descuento = (n * d) / 100;
  descuento = descuento.toFixed(0);
  return n - descuento;
};
let guardar = (products) => {
  fs.writeFileSync(
    path.join(__dirname, "../data/productsDataBase.json"),
    JSON.stringify(products, null, " "),
    "utf-8"
  );
};

const controller = {
  // Root - Show all products
  index: (req, res) => {
    res.render('products', {
      products,
      toThousand,
      discount,
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    let product = products.find((product) => product.id === +req.params.id);
    res.render('detail', {
      products,
      product,
      toThousand,
      discount,
    });
  },

  // Create - Form to create
  create: (req, res) => {
    res.render('product-create-form');
  },

  // Create -  Method to store
  store: (req, res) => {
    const { name, price, discount, category, description } = req.body;
    let product = {
      id: products[products.length - 1].id + 1, //productos en su posicion 16 - 1 (15).id es 16 + 1 = id 17
      name,
      description,
      price,
      discount,
      image: "default-image.png",
      category,
    };
    products.push(product);
    guardar(products);
    res.redirect('/products');

    // Do the magic
  },

  // Update - Form to edit
  edit: (req, res) => {
    let product = products.find((product) => product.id === +req.params.id);
    res.render('product-edit-form', {
      product,
    });
  },
  // Update - Method to update
  update: (req, res) => {
    const { name, price, discount, category, description } = req.body;
    products.forEach((product) => {
      if (product.id == +req.params.id) {
        product.name = name;
        product.price = price;
        product.discount = discount;
        product.category = category;
        product.description = description;
      }
    });
    guardar(products);
    res.redirect('/products');
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    products = products.filter((product) => product.id !== +req.params.id);
    guardar(products);
    res.redirect('/products');
  },
};

module.exports = controller;
