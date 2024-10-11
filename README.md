<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# TESLO API

1. Clonar el proyecto y ejecutar el comando

    ```
    bun i
    ```
  
2. Configurar variables de entorno basado en el tamplate __.env.template__

3. Levantar el contenedor de la base de datos

    ```
    docker-compose up -d
    ```
4. Levantar la API 
    ```
    bun start:dev
    ```

5. Ejecutar el SEED

    ```
    GET http://localhost:3000/api/seed
    ```