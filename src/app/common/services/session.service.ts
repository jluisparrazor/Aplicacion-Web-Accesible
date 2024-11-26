import { Injectable } from '@angular/core';
import { UserI } from '../models/users.models';
import { TeacherI } from '../models/teacher.models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private currentUser: UserI | TeacherI | null = null;
  private userType: 'user' | 'profesor' | 'admin' | null = null;

  setCurrentUser(user: UserI | TeacherI, type: 'user' | 'profesor' | 'admin') {
    this.currentUser = user;
    this.userType = type;
  }

  getCurrentUser(): UserI | TeacherI | null {
    return this.currentUser;
  }

  getUserType(): 'user' | 'profesor' | 'admin' | null {
    return this.userType;
  }

  clearSession() {
    this.currentUser = null;
    this.userType = null;
  }
}

