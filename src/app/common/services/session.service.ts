import { Injectable } from '@angular/core';
import { StudentI } from '../models/student.models';
import { TeacherI } from '../models/teacher.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private currentUser: StudentI | TeacherI | null = null;
  private userType: 'student' | 'teacher' | 'admin' | null = null;
  private sessionSubject = new BehaviorSubject<StudentI | TeacherI | null>(this.currentUser);

  setCurrentUser(user: StudentI | TeacherI | null, type: 'student' | 'teacher' | 'admin' | null) {
    this.currentUser = user;
    this.userType = type;
    this.sessionSubject.next(this.currentUser); // Emit the new session state
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
    this.sessionSubject.next(this.currentUser); // Emit the cleared session state
  }
  
  getSessionObservable() { return this.sessionSubject.asObservable(); }
}

