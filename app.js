const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Rutas de productos
const productsRouter = express.Router();

// Datos de ejemplo para productos
let products = [
  {
    id: '1',
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    code: 'ABC123',
    price: 10.99,
    status: true,
    stock: 50,
    category: 'Electronics',
    thumbnails: ['image1.jpg', 'image2.jpg']
  },
  {
    id: '2',
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    code: 'DEF456',
    price: 19.99,
    status: false,
    stock: 25,
    category: 'Clothing',
    thumbnails: ['image3.jpg']
  }
];

// Obtener todos los productos
productsRouter.get('/', (req, res) => {
  res.json(products);
});

// Obtener un producto por su id
productsRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = products.find(p => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
  const newProduct = {
    id: generateUniqueId(),
    ...req.body
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Actualizar un producto por su id
productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      id: productId // Aseguramos que el id no se modifique
    };
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto por su id
productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct[0]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.use('/api/products', productsRouter);

// Rutas de carritos
const cartsRouter = express.Router();

// Datos de ejemplo para carritos
let carts = [];

// Crear un nuevo carrito
cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: generateUniqueId(),
    products: []
  };
  carts.push(newCart);
  res.status(201).json(newCart);
});

// Listar los productos de un carrito
cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find(c => c.id === cartId);
  if (cart) {
    const cartProducts = cart.products.map(cartProduct => {
      const product = products.find(p => p.id === cartProduct.product);
      return {
        ...cartProduct,
        product
      };
    });
    res.json(cartProducts);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  const cart = carts.find(c => c.id === cartId);
  if (cart) {
    const productIndex = cart.products.findIndex(p => p.product === productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

app.use('/api/carts', cartsRouter);

// Función para generar un id único
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Ruta raíz del servidor
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de productos y carritos');
  });
  

// Configurar el servidor para escuchar en el puerto 8080
app.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
