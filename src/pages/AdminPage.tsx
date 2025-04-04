import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { User } from '../models/User';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestore, fromFirebaseDocs } from '../lib/firebase';
import { Config } from '../models/Config';


export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [requiredStaffCount, setRequiredStaffCount] = useState<number>(0);

    useEffect(() => {
        return onSnapshot(collection(firestore, "users"), (snapshot) => {
            const users = fromFirebaseDocs<User>(snapshot.docs);
            setUsers(users);
        });
    }, [])

    useEffect(() => {
        return onSnapshot(doc(firestore, "config", 'public'), (snapshot) => {
            const data = snapshot.data() as Config;

            setRequiredStaffCount(data?.requiredStaffCount || 0);
        });
    }, [])

    const handleSwitchChange = async (user: User) => {
        const userUpdate: Partial<User> = {
            working: !user.working,
        };

        await updateDoc(doc(firestore, "users", user.id), userUpdate);
    };



    return (
        <Container>
            <h1>Admin Page - Registered Users</h1>
            <div className='d-flex flex-column gap-3'>
                <h2>Required Staff Count: {requiredStaffCount}</h2>

                {users.map((user) => (
                    <div key={user.id} className='border rounded p-3  d-flex shadow'>
                        <div style={{ background: user.color, width: 20 }} className='me-2' />
                        {user.name} - {user.phone}
                        <Form.Check
                            className='ms-auto'
                            type="switch"
                            id={`switch-${user.id}`}
                            checked={user.working}
                            onChange={() => handleSwitchChange(user)}
                        />

                    </div>
                ))}
            </div>
        </Container>
    );
}








