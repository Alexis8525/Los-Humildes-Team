# Los-Humildes-Team

## API Backend - Documentación de Endpoints

---

### Base URL
`http://localhost:3000`

---

## Endpoints

---

### Usuarios

#### Registro de usuario
- **Ruta:** `/registro`
- **Método:** POST
- **Descripción:** Registra un nuevo usuario.
- **Body (JSON):**
```json
{
  "name": "Juan",
  "lastN": "Pérez",
  "email": "juan.perez@example.com",
  "pass": "Password123!",
  "policityAccepted": true
}
```
Respuestas:

Código | Descripción
-------|------------------------------
200    | Login exitoso, token JWT devuelto.
400    | Credenciales inválidas.


## Confirmar cuenta
- **Ruta:** `/confirmar-cuenta/:token`
- **Método:** GET
- **Descripción:** Confirma la cuenta de usuario usando un token enviado por correo.

## Login
- **Ruta:** `/login`
- **Método:** POST
- **Descripción:** Autentica usuario y devuelve token JWT.
- **Body (JSON):**
```json
{
  "email": "juan.perez@example.com",
  "pass": "Password123!"
}
```

Respuestas:

Código | Descripción
-------|------------------------------
200    | Login exitoso, token JWT devuelto.
400    | Credenciales inválidas.

## Verificar 2FA
- **Ruta:** `/verify-2fa`
- **Método:** POST
- **Descripción:** Verifica código de autenticación de dos factores.

---

## Reset de contraseña

### Solicitar token
- **Ruta:** `/tkn-reset`
- **Método:** POST
- **Descripción:** Solicita token para restablecer contraseña.

### Confirmar token
- **Ruta:** `/new-pass/:token`
- **Método:** GET
- **Descripción:** Valida token para cambiar contraseña.

### Cambiar contraseña
- **Ruta:** `/new-pass/:token`
- **Método:** POST
- **Descripción:** Cambia la contraseña.
- **Body (JSON):**
```json
{
  "pass": "NewPassword123!"
}
```
## Ejercicios

### Agregar ejercicio
- **Ruta:** `/add`
- **Método:** POST
- **Middleware:** `checkAuth`
- **Body (JSON):**
```json
{
  "name": "Sentadillas",
  "muscleGroups": ["piernas", "glúteos"],
  "equipmentRequired": "pesas",
  "difficulty": "medio",
  "videoUrl": "http://video.com/sentadillas",
  "visibility": "system"
}
```
### Listar ejercicios (varios filtros)
- **Ruta:** `/`  
  **Método:** GET  
  **Descripción:** Ejercicios del usuario y sistema (requiere `checkAuth`).

- **Ruta:** `/by-user`  
  **Método:** GET  
  **Descripción:** Ejercicios solo del usuario (requiere `checkAuth`).

- **Ruta:** `/by-system`  
  **Método:** GET  
  **Descripción:** Ejercicios del sistema (público).

- **Ruta:** `/all`  
  **Método:** GET  
  **Descripción:** Todos los ejercicios (requiere `checkAuth` y `checkRole`).

### Editar ejercicio
- **Ruta:** `/edit/:id`
- **Método:** PATCH
- **Middleware:** `checkAuth`
- **Descripción:** Modifica campos del ejercicio.
- **Body:** Campos a modificar.

### Eliminar ejercicio
- **Ruta:** `/delete/:id`
- **Método:** DELETE
- **Middleware:** `checkAuth`
- **Descripción:** Elimina un ejercicio por ID.



