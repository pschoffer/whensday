import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

export default function MessageLog() {
    useEffect(() => {
        const q = query(collection(firestore, "logs"), limit(5));
        return onSnapshot(q, (snapshot) => {
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
