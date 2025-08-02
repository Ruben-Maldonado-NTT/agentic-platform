import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/assets/mocks/users.json').subscribe((data) => {
      this.users = data;
    });
  }

  deleteUser(user: any) {
    const confirmed = confirm(`Delete user ${user.name}?`);
    if (confirmed) {
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }

  changeRole(user: any) {
    const newRole = prompt(`New role for ${user.name} (admin/editor/viewer):`, user.role);
    if (newRole) {
      user.role = newRole;
    }
  }
}
