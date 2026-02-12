# API Bait – Documentación

## OpenAPI (openapi.yaml)

Especificación de la API en OpenAPI 3.0.3: recursos organizados por modelo (Farms, Lots, Animals, Expenses, Loans, Companies, Purchases, Catalogs), con descripción de cada endpoint y esquemas de request/response.

**Uso:**

- **Swagger UI:** Puedes servir `openapi.yaml` con [Swagger UI](https://swagger.io/tools/swagger-ui/) o con un editor como [Swagger Editor](https://editor.swagger.io/) (File → Import file).
- **Generar cliente:** Herramientas como `openapi-generator` o `@openapitools/openapi-generator-cli` pueden generar clientes a partir de este archivo.
- **Base path:** En el documento, `servers[0].url` está definido como `/api/v1`; ajusta el host según el entorno (desarrollo/producción).

La API asume **multi-usuario**: el token (Bearer JWT) identifica al usuario y los recursos (fincas, etc.) se filtran por él. Para que “mis fincas” sea por usuario, el modelo de datos debe asociar fincas al usuario (p. ej. `Farm.userId`).
