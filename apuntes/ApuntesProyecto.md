# Proyecto

## 1. Estructura del Proyecto

```
my-app/
├── android/
├── ios/
├── src/
│   ├── app/
│   ├── assets/
│   ├── environments/
│   ├── pages/
│   ├── services/
│   ├── theme/
│   ├── global.scss
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   └── test.ts
├── capacitor.config.ts
├── package.json
└── ...
```

### Descripción de las Carpetas y Archivos

#### ` android ` y `ios`


- **Descripción**: Estas carpetas contienen los proyectos específicos de Android y iOS generados por Capacitor.
- **Contenido**: Código nativo y configuraciones específicas de cada plataforma.

#### `src`


- **Descripción**: Contiene todo el código fuente de la aplicación.
- **Contenido**: Subcarpetas y archivos que componen la aplicación.

##### `app`


- **Descripción**: Contiene los módulos y componentes principales de la aplicación.
- **Contenido**:
  - **`app.module.ts`**: El módulo raíz de la aplicación.
  - **`app.component.ts`**: El componente raíz de la aplicación.
  - **`app-routing.module.ts`**: Configuración de las rutas de la aplicación.
  - **Otros módulos y componentes**: Organiza los módulos y componentes adicionales aquí.

##### `assets`


- **Descripción**: Contiene recursos estáticos como imágenes, fuentes y otros archivos que no cambian durante la ejecución de la aplicación.
- **Contenido**:
  - **Imágenes**: Logos, iconos, etc.
  - **Fuentes**: Archivos de fuentes personalizadas.

##### `environments`

- **Descripción**: Contiene archivos de configuración para diferentes entornos (desarrollo, producción, etc.).
- **Contenido**:
  - **`environment.ts`**: Configuración para el entorno de desarrollo.
  - **`environment.prod.ts`**: Configuración para el entorno de producción.

##### `pages`
- **Descripción**: Contiene las páginas de la aplicación.
- **Contenido**:
  - **Páginas individuales**: Cada página tiene su propio módulo, componente, HTML, SCSS y archivo de pruebas.

##### `services`
- **Descripción**: Contiene servicios de Angular que manejan la lógica de negocio y las interacciones con APIs externas como Firebase.
- **Contenido**:
  - **Servicios individuales**: Cada servicio tiene su propio archivo TypeScript.

##### `theme`


- **Descripción**: Contiene archivos de estilos globales y variables de tema.
- **Contenido**:
  - **`variables.scss`**: Variables de tema globales.
  - **Otros archivos SCSS**: Estilos globales adicionales.

##### `global.scss`


- **Descripción**: Archivo de estilos globales que se aplica a toda la aplicación.
- **Contenido**: Estilos CSS/SCSS que afectan a toda la aplicación.

#####  `index.html`


- **Descripción**: El archivo HTML principal de la aplicación.
- **Contenido**: Estructura básica del HTML, enlaces a scripts y estilos.

##### `main.ts`


- **Descripción**: El punto de entrada principal de la aplicación.
- **Contenido**: Código para inicializar y arrancar la aplicación Angular.

##### `polyfills.ts`


- **Descripción**: Contiene polyfills necesarios para soportar navegadores más antiguos.
- **Contenido**: Importaciones de polyfills.

##### `test.ts`


- **Descripción**: Configuración para ejecutar pruebas unitarias.
- **Contenido**: Código de configuración de pruebas.

### Archivos de Configuración

#### `capacitor.config.ts`


- **Descripción**: Configuración de Capacitor para la aplicación.
- **Contenido**: Información sobre el ID de la aplicación, nombre, directorio web, y configuraciones específicas de plataformas.

#### `package.json`


- **Descripción**: Archivo de configuración de npm que lista las dependencias del proyecto y scripts de comandos.
- **Contenido**: Dependencias, scripts de npm, metadatos del proyecto.

## 2. Uso de GitHub para Control de Versiones

GitHub es una plataforma popular para el control de versiones y la colaboración en proyectos de software. Usar GitHub te permite mantener un historial de cambios en tu código, colaborar con otros desarrolladores y gestionar diferentes versiones de tu proyecto.

### Recomendación: GitHub Desktop

GitHub Desktop es una aplicación que facilita la gestión de repositorios Git y la interacción con GitHub mediante una interfaz gráfica. Es especialmente útil si prefieres no usar la línea de comandos para las operaciones de Git.

### Instalación de GitHub Desktop

1. **Descargar GitHub Desktop**: Ve a [desktop.github.com](https://desktop.github.com/) y descarga la aplicación.
2. **Instalar GitHub Desktop**: Sigue las instrucciones de instalación para tu sistema operativo.

### Configuración Inicial

1. **Iniciar sesión en GitHub**: Abre GitHub Desktop y sigue las instrucciones para iniciar sesión en tu cuenta de GitHub.
2. **Clonar un Repositorio**: Puedes clonar un repositorio existente desde GitHub o crear uno nuevo.

### Uso de Ramas en Git

Las ramas en Git te permiten trabajar en diferentes características o correcciones de errores de manera aislada. Esto facilita la colaboración y evita conflictos en el código.

#### Buenas Prácticas para el Uso de Ramas

1. **Rama Principal (`main` o `master`)**: Esta rama debe contener siempre el código estable y listo para producción.
2. **Ramas de Características (`feature`)**: Crea una nueva rama para cada nueva característica que estés desarrollando.
3. **Ramas de Corrección de Errores (`bugfix`)**: Crea una nueva rama para cada corrección de errores.
4. **Ramas de Desarrollo (`develop`)**: Opcionalmente, puedes tener una rama `develop` donde se integran todas las características antes de fusionarlas en `main`.

#### Flujo de Trabajo con Ramas

1. **Crear una Nueva Rama**:
   - En GitHub Desktop, selecciona `Branch` > `New Branch`.
   - Nombra la rama de acuerdo a la característica o corrección que estás trabajando, por ejemplo, `feature/nueva-funcionalidad` o `bugfix/correccion-error`.

2. **Trabajar en la Nueva Rama**:
   - Realiza tus cambios en la nueva rama.
   - Guarda y confirma tus cambios (`commit`) regularmente.

3. **Fusionar la Rama**:
   - Una vez que hayas terminado de trabajar en tu rama, crea un `Pull Request` (PR) en GitHub para fusionar tus cambios en la rama principal (`main` o `develop`).
   - Revisa y aprueba el PR, y luego fusiónalo.

4. **Eliminar la Rama**:
   - Después de fusionar, puedes eliminar la rama para mantener tu repositorio limpio.

