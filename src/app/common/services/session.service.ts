import { Injectable } from '@angular/core';
import { StudentI } from '../models/student.models';
import { TeacherI } from '../models/teacher.models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private currentUser: StudentI | TeacherI | null = null;
  private userType: 'student' | 'teacher' | 'admin' | null = null;

  setCurrentUser(user: StudentI | TeacherI, type: 'student' | 'teacher' | 'admin') {
    this.currentUser = user;
    this.userType = type;
  }

  getCurrentUser(): StudentI | TeacherI | null {
    return this.currentUser;
  }

  getUserType(): 'student' | 'teacher' | 'admin' | null {
    return this.userType;
  }

  clearSession() {
    this.currentUser = null;
    this.userType = null;
  }
}

