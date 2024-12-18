import { NgModule } from '@angular/core'; 
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'homeprofesor',
    loadComponent: () => import('./pages/Homes/home-profesor/home-profesor.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'paginainicial',
    pathMatch: 'full',
  },
  {
    path: 'loginprofesor', 
    loadComponent: () => import('./pages/Homes/login-profesor/login-profesor.page').then( m => m.LoginPage)
  },
  {
    path: 'loginalumno',
    loadComponent: () => import('./pages/Homes/home-alumno/login-alumno/login-alumno.page').then( m => m.LoginAlumnoPage)
  },
  {
    path: 'paginainicial',
    loadComponent: () => import('./pages/pagina-inicial/pagina-inicial.page').then( m => m.PaginaInicialPage)
  },
  {
    path: 'tareasdiarioalumno',
    loadComponent: () => import('./pages/Tareas/tareas-diario-alumno/tareas-diario-alumno.page').then( m => m.TareasDiarioAlumnoPage)
  },
  {
    path: 'registrosemanaltareas',
    loadComponent: () => import('./pages/Tareas/registro-semanal/registro-semanal.page').then( m => m.RegistroSemanalPage)
  },
  {
    path: 'tareasporpasos',
    loadComponent: () => import('./pages/Tareas/tareas-por-pasos/tareas-por-pasos.page').then( m => m.TareasPorPasosPage)
  },
  {
    path: 'tareasaplicacionjuego',
    loadComponent: () => import('./pages/Tareas/tareas-aplicacion-juego/tareas-aplicacion-juego.page').then( m => m.TareasAplicacionJuegoPage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/Homes/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  {
    path: 'edit-profesor',
    loadComponent: () => import('./pages/Homes/home-profesor/edit-profesor/edit-profesor.page').then( m => m.EditProfesorPage)
  },
  {
    path: 'homeadministrador',
    loadComponent: () => import('./pages/Homes/home-administrador/home-administrador.page').then( m => m.HomeAdministradorPage)
  },
  {
    path: 'admin-tareas',
    loadComponent: () => import('./pages/Homes/home-administrador/admin-tareas/admin-tareas.page').then( m => m.AdminTareasPage)
  },
  {
  path: 'admin-profesores',
  loadComponent: () => import('./pages/Homes/home-administrador/admin-profesores/admin-profesores.page').then( m => m.AdminProfesoresPage)
  },
  {
    path: 'admin-alumnos',
    loadComponent: () => import('./pages/Homes/home-administrador/admin-alumnos/admin-alumnos.page').then( m => m.AdminAlumnosPage)
    },
  {
    path: 'material-demand',
    loadComponent: () => import('./pages/Homes/home-profesor/peticiones-material/peticiones-material.page').then( m => m.PeticionesMaterialPage)
  },
  {
    path: 'task-menus',
    loadComponent: () => import('./pages/Tareas/task-menus/task-menus.page').then( m => m.TaskMenusPage)
  },
  {
    path: 'show-menus',
    loadComponent: () => import('./pages/Menus/show-menus/show-menus.page').then( m => m.ShowMenusPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'material-update',
    loadComponent: () => import('./pages/Homes/home-administrador/material-update/material-update.page').then( m => m.MaterialUpdatePage)
  },
  {
    path: 'classes',
    loadComponent: () => import('./pages/classes/classes.page').then( m => m.ClassesPage)
  },
  {
    path: 'menutypes',
    loadComponent: () => import('./pages/Menus/menutypes/menutypes.page').then( m => m.MenuTypesPage)
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./pages/Homes/mi-perfil/mi-perfil.page').then( m => m.MiPerfilPage)
  },
  {
    path: 'task-material-request',
    loadComponent: () => import('./pages/Tareas/task-material-request/task-material-request.page').then( m => m.TaskMaterialRequestPage)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }