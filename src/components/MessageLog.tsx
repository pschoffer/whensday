import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

export default function MessageLog() {
    useEffect(() => {
        return onSnapshot(collection(firestore, "logs"), (snapshot) => {
            const changes = snapshot.docChanges();

            changes.forEach((change) => {
                if (change.type === "added") {
                    const logItem = change.doc.data();
                    toast.info(logItem.message)
                }
            });

        });
    }, [])

    return (
        <div>
            <ToastContainer stacked position='bottom-center' />
        </div>
    )
}
