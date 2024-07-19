
## Hack Labs - REST API

Este proyecto es una API basada en la arquitectura REST proporcionando diversos metodos HTTP los cuales permiten realizar las operciones basicas CRUD. Sin embargo, la API esta construida de tal manera que solo el administrador puede realizar operaciones modificacion, no obstante existen endpoints de consulta publica accesible a traves de peticiones GET que devuelven estadisticas que los usuarios realizan con las herramientas de pentesting (link). 

Asi mismo, esta maneja procesos de autenticacion mediante JWT (Json Web Tokens) y Loggin mediante Middlewares.
- **Arquitectura:**
				![enter image description here](https://raw.githubusercontent.com/XanderL2/RestApi-HackLabs/main/.preview/architecture.png)

- **Autenticacion:**
	![enter image description here](https://raw.githubusercontent.com/XanderL2/RestApi-HackLabs/main/.preview/authentication.png)


## Tecnologias:

- *Node JS:* Entorno de Ejecución
- *Express JS:* Framework de desarrollo
- *JWT (Json Web Tokens):* Autenticacion
- *Json:* Lenguaje de transmision de datos
- *Middleware de Loggin:* Morgan
- *Conexiones SQL:* Mysql2


## Endpoints de libre acceso:

```javascript

//Endpoint de consulta
let users = baseURL + "/api/users"; // Es posible manejar Queries y Params URL

let statistics = baseURL + "/api/statistics"; // Es posible manejar Queries y Params URL

```
