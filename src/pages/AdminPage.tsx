import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { User } from '../models/User';


const usersData: User[] = [
  { id: "1", name: "Captain Giggles", phone: "+12345678901", working: true },
  { id: "2", name: "Sir Laughs-a-Lot", phone: "+12345678902", working: false },
  { id: "3", name: "Duke Chuckles", phone: "+12345678903", working: true },
  { id: "4", name: "Lady Snort", phone: "+12345678904", working: false }
];

export default function AdminPage() {
  const [users] = useState<User[]>(usersData);
  const handleSwitchChange = (userId: string) => {
    // Toggle the "working" status of the user
    // const updatedUsers = users.map(user => {
    //   if (user.id === userId) {
    //     return { ...user, working: !user.working };
    //   }
    //   return user;
    // });
    //setUsers(updatedUsers);
  };

  return (
    <Container>
      <h1>Admin Page - Registered Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.phone}
            <Form.Check
                type="switch"
                id={`switch-${user.id}`}
              //  label={user.working ? "Working" : "Not Working"}
                checked={user.working}
                onChange={() => handleSwitchChange(user.id)}
              />
            
          </li>
        ))}
      </ul>
    </Container>
  );
}








