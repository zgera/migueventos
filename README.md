Integrantes: Joaquin Fernandenz y Valentin Gerakios

Instrucciones para compilar el codigo:

1) Instalar librerias
     npm install
  
2) Ejecutarlo (Backend)
     npm run dev

Instrucciones para ejecutar test:
    npm test

Con respecto al diseño de la API, decidimos utilizar una estructura limpia separando el codigo en distintas capas:
 Repositorios: Acceden a los datos persistidos
 Servicios: Validaciones y logica de negocio
 Rutas: Logica de conexion con el cliente

Ademas, dentro de cada capa utilizamos la programacion orientada objetos, utilizando sus estamentos, como la Herencia o la Abstraccion, los principios SOLID y patrones de diseño como lo pueden ser el Strategy.
