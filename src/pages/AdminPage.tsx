import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Form, Alert, Button, Modal } from 'react-bootstrap';
import { User } from '../models/User';
import { collection, doc, onSnapshot, updateDoc, orderBy, limit, query } from 'firebase/firestore';
import { firestore, fromFirebaseDocs } from '../lib/firebase';
import { Config } from '../models/Config';


export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [requiredStaffCount, setRequiredStaffCount] = useState<number>(0);
    const [smsLogs, setSmsLogs] = useState<any[]>([]);  // State to store the SMS logs
    const [showSmsModal, setShowSmsModal] = useState(false);
    const [latestSMS, setLatestSMS] = useState<string | null>(null);

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
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(firestore, "smsLogs"), orderBy("timestamp", "desc"), limit(3)),
            (snapshot: { docs: any[]; }) => {
                const logs = snapshot.docs.map(doc => doc.data());
                logs.forEach(log => {
                    if (log.message !== latestSMS) {  // Prevent duplicate toasts
                        toast.info(`📩 SMS sent to ${log.phone}: ${log.message}`, {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        setLatestSMS(log.message); // Update latestSMS state
                    }
                });

                setSmsLogs(logs);
            }
        );

        return unsubscribe;
    }, [latestSMS]);
    //const updateAvailableStaffCount = (users: User[]) => {
        const WorkingCount = users.filter(user => user.working).length;
    //};

    const handleSwitchChange = async (user: User) => {
        const userUpdate: Partial<User> = {
            working: !user.working,
        };

        await updateDoc(doc(firestore, "users", user.id), userUpdate);
    };
    const handleShowSmsModal = () => setShowSmsModal(true);
    const handleCloseSmsModal = () => setShowSmsModal(false);


    return (
        <Container>
            <h1>Admin Page - Registered Users</h1>
            <div className='d-flex flex-column gap-3'>
           

                    <Alert variant={WorkingCount < requiredStaffCount ? "danger" : 'success'} className="m-0">
                    Staff: {WorkingCount}/{requiredStaffCount}
                    </Alert>

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
            <Button variant="info" onClick={handleShowSmsModal} className="mt-3">
                View Last 3 SMS Sent
            </Button>
            <Modal show={showSmsModal} onHide={handleCloseSmsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Last 3 SMS Sent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {smsLogs.slice(0, 3).map((log, index) => (
                                <li key={index}>
                                    <strong>To:</strong> {log.phone} <br />
                                    <strong>Message:</strong> {log.message} <br />
                                    <strong>Timestamp:</strong> {new Date(log.timestamp.seconds * 1000).toLocaleString()}
                                </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSmsModal}>Close</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />

        </Container>
    );
}