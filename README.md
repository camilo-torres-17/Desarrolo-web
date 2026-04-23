# Algoritmos Preciosos

Aplicación web de comercio electrónico enfocada en la gestión y visualización de productos de joyería. El sistema permite la administración de productos mediante un panel interno, así como la navegación por categorías y búsqueda en tiempo real.

---

## Descripción

Este proyecto consiste en una tienda web desarrollada con tecnologías del entorno JavaScript, que implementa funcionalidades básicas de un sistema e-commerce sin el uso de bases de datos relacionales. La información se gestiona mediante archivos JSON, lo que permite un enfoque sencillo y didáctico para el manejo de datos.

---

## Funcionalidades principales

* Visualización de productos organizados por categorías
* Sistema de búsqueda en tiempo real
* Carrito de compras
* Panel de administración con las siguientes capacidades:

  * Creación de productos
  * Eliminación de productos
  * Subida de imágenes
  * Vista previa de imágenes antes de guardar
* Persistencia de datos mediante archivo JSON

---

## Tecnologías utilizadas

* Node.js
* Express
* Multer (gestión de subida de archivos)
* HTML5
* CSS3
* JavaScript

---

## Estructura del proyecto

```id="p3z0m1"
/public
   /images
      /inicio
      /uploads
   /css
   /js
   /views

/data
   productos.json

server.js
```

---

## Instalación y ejecución

1. Clonar el repositorio
2. Instalar las dependencias necesarias:

```id="w1n5tx"
npm install
```

3. Ejecutar el servidor:

```id="b7h3k2"
node server.js
```

4. Acceder desde el navegador en:

```id="t9k2lv"
http://localhost:3000
```

---

## Acceso al panel de administración

El panel de administración se encuentra disponible en la siguiente ruta:

```id="u4v8re"
/admin
```

Desde esta sección se pueden gestionar los productos del sistema.

---

## Gestión de categorías

Las categorías de los productos deben coincidir exactamente con los valores utilizados en el sistema para su correcta visualización. Ejemplos:

* anillos
* cadenas
* dijes
* aretes
* pulseras
* esmeraldas
* lineahombre
* lineamujer

---

## Consideraciones técnicas

* Las imágenes cargadas se almacenan en el directorio `/public/images/uploads`
* En caso de no proporcionar imagen, se utiliza una imagen por defecto
* El archivo `/data/productos.json` funciona como almacenamiento principal de datos
* La integridad de los datos depende de la correcta manipulación de este archivo

---

## Autor

Stefania Mendez Forero
Edinson Fernando Rincon Estevez
Camilo Andres Torres Mendoza
