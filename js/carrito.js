document.addEventListener('DOMContentLoaded', () => {
  const baseDeDatos = [
    {
      id: 1,
      nombre: "Buzo Triple-K",
      precio: 4900,
      imagen: "../images/buzo.jpg"
    },
    {
      id: 2,
      nombre: "Buzo Urban",
      precio: 4500,
      imagen: "../images/buzo5.jpg"
    },
    {
      id: 3,
      nombre: "Buzo Tacuara",
      precio: 4700,
      imagen: "../images/buzo3.jpg",
    },
    {
      id: 4,
      nombre: "Pantalon Flower",
      precio: 3900,
      imagen: "../images/pantalones.jpg"
    },
    {
      id: 5,
      nombre: "Buzo BSAS-K",
      precio: 4900,
      imagen: "../images/buzo bsas.jpg"
    },
    {
      id: 6,
      nombre: "Buzo Colorinche",
      precio: 4500,
      imagen: "../images/Buzos.jpg"
    },
    {
      id: 7,
      nombre: "Buzo Amarello",
      precio: 5700,
      imagen: "../images/buzoama.jpg"
    },
    {
      id: 8,
      nombre: "Campera Oslo KOK",
      precio: 5200,
      imagen: "../images/campera1.jpg"
    },
    {
      id: 9,
      nombre: "Buzo Cruel",
      precio: 4600,
      imagen: "../images/buzoblanconegro.jpg"
    },
    {
      id: 10,
      nombre: "Buzo Pista",
      precio: 4500,
      imagen: "../images/buzoblue.jpg"
    },
    {
      id: 11,
      nombre: "Buzo Bielsa",
      precio: 4700,
      imagen: "../images/buzoloco.jpg"
    },
    {
      id: 12,
      nombre: "Coleccion Pela",
      precio: 7800,
      imagen: "../images/colecciones.jpg"
    },
    {
      id: 13,
      nombre: "Pantalon Black-k",
      precio: 4500,
      imagen: "../images/pantalon.jpg"
    },
    {
      id: 14,
      nombre: "Remera Urban-k",
      precio: 4700,
      imagen: "../images/urban.jpg"
    },
    {
      id: 15,
      nombre: "Coleccion Facha",
      precio: 8900,
      imagen: "../images/buzo2.jpg"
    }
  ];

  // Variables

  let carrito = [];
  const divisa = '$';
  const DOMitems = document.querySelector('#items');
  const DOMcarrito = document.querySelector('#carrito');
  const DOMtotal = document.querySelector('#total');
  const DOMbotonVaciar = document.querySelector('#boton-vaciar');
  const miLocalStorage = window.localStorage;

  // Funciones
  function renderizarProductos() {
    baseDeDatos.forEach((info) => {
      const miNodo = document.createElement('div');
      miNodo.classList.add('card', 'col-sm-4');
      const miNodoCardBody = document.createElement('div');
      miNodoCardBody.classList.add('card-body');
      const miNodoTitle = document.createElement('h5');
      miNodoTitle.classList.add('card-title');
      miNodoTitle.textContent = info.nombre;
      const miNodoImagen = document.createElement('img');
      miNodoImagen.classList.add('img-fluid');
      miNodoImagen.setAttribute('src', info.imagen);
      const miNodoPrecio = document.createElement('p');
      miNodoPrecio.classList.add('card-text');
      miNodoPrecio.textContent = `${info.precio}${divisa}`;
      const miNodoBoton = document.createElement('button');
      miNodoBoton.classList.add('btn', 'btn-primary');
      miNodoBoton.textContent = '+';
      miNodoBoton.setAttribute('marcador', info.id);
      miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
      // Insertamos
      miNodoCardBody.appendChild(miNodoImagen);
      miNodoCardBody.appendChild(miNodoTitle);
      miNodoCardBody.appendChild(miNodoPrecio);
      miNodoCardBody.appendChild(miNodoBoton);
      miNodo.appendChild(miNodoCardBody);
      DOMitems.appendChild(miNodo);
    });
  }


  /*  Evento para añadir un producto al carrito de la compra */

  function anyadirProductoAlCarrito(evento) {
    carrito.push(evento.target.getAttribute('marcador'))
    // Actualizamos el carrito 
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();
  }

  /* Dibuja todos los productos guardados en el carrito */

  function renderizarCarrito() {
    // Vaciamos todo el html
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
      // Obtenemos el item que necesitamos de la variable base de datos
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        // ¿Coincide las id? Solo puede existir un caso
        return itemBaseDatos.id === parseInt(item);
      });
      // Cuenta el número de veces que se repite el producto
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {
        // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
        return itemId === item ? total += 1 : total;
      }, 0);
      // Creamos el nodo del item del carrito
      const miNodo = document.createElement('li');
      miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
      miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
      // Boton de borrar
      const miBoton = document.createElement('button');
      miBoton.classList.add('btn', 'btn-danger', 'mx-5');
      miBoton.textContent = 'X';
      miBoton.style.marginLeft = '1rem';
      miBoton.dataset.item = item;
      miBoton.addEventListener('click', borrarItemCarrito);
      // Mezclamos nodos
      miNodo.appendChild(miBoton);
      DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
  }

  /* Evento para borrar un elemento del carrito */

  function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
      return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();

  }


  /* Calcula el precio total teniendo en cuenta los productos repetidos */
  function calcularTotal() {
    // Recorremos el array del carrito 
    return carrito.reduce((total, item) => {
      // De cada elemento obtenemos su precio
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        return itemBaseDatos.id === parseInt(item);
      });
      // Los sumamos al total
      return total + miItem[0].precio;
    }, 0).toFixed(2);
  }


  /* Varia el carrito y vuelve a dibujarlo */

  function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    // Borra LocalStorage
    localStorage.clear();

  }

  function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function cargarCarritoDeLocalStorage() {
    // ¿Existe un carrito previo guardado en LocalStorage?
    if (miLocalStorage.getItem('carrito') !== null) {
      // Carga la información
      carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
  }

  // Eventos
  DOMbotonVaciar.addEventListener('click', vaciarCarrito);

  // Inicio
  cargarCarritoDeLocalStorage();
  renderizarProductos();
  renderizarCarrito();
});

const API = "../products.json";

const getProducts = async () => {

  const respuesta = await fetch(API);

  products = await respuesta.json();

  console.log(products);
}
getProducts();

