import { Injectable } from '@angular/core';
import { UserI } from '../models/users.models';
import { ProfI } from '../models/profesor.models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private currentUser: UserI | ProfI | null = null;
  private userType: 'user' | 'profesor' | 'admin' | null = null;

  setCurrentUser(user: UserI | ProfI, type: 'user' | 'profesor' | 'admin') {
    this.currentUser = user;
    this.userType = type;
  }

  getCurrentUser(): UserI | ProfI | null {
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

