import { NgModule } from '@angular/core'; 
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'homeprofesor',
    loadComponent: () => import('./pages/home-profesor/home-profesor.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'paginainicial',
    pathMatch: 'full',
  },
  {
    path: 'loginprofesor',
    loadComponent: () => import('./pages/home-profesor/login-profesor/login-profesor.page').then( m => m.LoginPage)
  },
  {
    path: 'loginalumno',
    loadComponent: () => import('./pages/home-alumno/login-alumno/login-alumno.page').then( m => m.LoginAlumnoPage)
  },
  {
    path: 'paginainicial',
    loadComponent: () => import('./pages/pagina-inicial/pagina-inicial.page').then( m => m.PaginaInicialPage)
  },
  {
    path: 'tareasdiarioalumno',
    loadComponent: () => import('./pages/tareas-diario-alumno/tareas-diario-alumno.page').then( m => m.TareasDiarioAlumnoPage)
  },
  {
    path: 'registrosemanaltareas',
    loadComponent: () => import('./pages/registro-semanal/registro-semanal.page').then( m => m.RegistroSemanalPage)
  },
  {
    path: 'tareasporpasos',
    loadComponent: () => import('./pages/tareas-por-pasos/tareas-por-pasos.page').then( m => m.TareasPorPasosPage)
  },
  {
    path: 'tareasaplicacionjuego',
    loadComponent: () => import('./pages/tareas-aplicacion-juego/tareas-aplicacion-juego.page').then( m => m.TareasAplicacionJuegoPage)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./pages/home-profesor/login-profesor/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
  {
    path: 'edit-profesor',
    loadComponent: () => import('./pages/home-profesor/edit-profesor/edit-profesor.page').then( m => m.EditProfesorPage)
  },
  {
    path: 'homeadministrador',
    loadComponent: () => import('./pages/home-administrador/home-administrador.page').then( m => m.HomeAdministradorPage)
  },
  {
    path: 'material-demand',
    loadComponent: () => import('./pages/home-profesor/peticiones-material/peticiones-material.page').then( m => m.PeticionesMaterialPage)
  },
  {
    path: 'task-menus',
    loadComponent: () => import('./pages/task-menus/task-menus.page').then( m => m.TaskMenusPage)
  },
  {
    path: 'show-menus',
    loadComponent: () => import('./pages/show-menus/show-menus.page').then( m => m.ShowMenusPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }