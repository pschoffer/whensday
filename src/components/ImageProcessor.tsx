import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { firestore, fromFirebaseDocs, storage } from '../lib/firebase'
import { Image } from '../models/Image'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'

export default function ImageProcessor() {
    const [images, setImages] = React.useState<Image[]>([])

    useEffect(() => {
        return onSnapshot(collection(firestore, "images"), (snapshot) => {
            const images = fromFirebaseDocs<Image>(snapshot.docs)
            setImages(images)
        })
    }, [])

    const handleNewPicture = async () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.capture = 'environment'
        input.accept = 'image/*'

        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0]
            if (!file) return

            const storageRef = ref(storage, `images/${file.name}`)
            const uploadedFile = await uploadBytes(storageRef, file)

            const publicUrl = await getDownloadURL(uploadedFile.ref);
            const newImage: Partial<Image> = {
                imageUrl: publicUrl,
                fileName: file.name,
                fileType: file.type,
            }
            await addDoc(collection(firestore, 'images'), newImage)
        }
        input.click()
    }

    return (
        <div className='px-3 d-flex flex-column gap-3'>
            <div className='d-flex justify-content-end'>
                <Button onClick={handleNewPicture}>+ Take Picture</Button>
            </div>

            {images.map((image) => (
                <div key={image.imageUrl} className='border rounded p-3  d-flex flex-column shadow'>
                    <img src={image.imageUrl} alt={image.fileName} style={{ maxWidth: 100, maxHeight: 100 }} />
                    <p className='m-0'>People: {image.requiredCount}</p>
                </div>
            ))}
        </div>
    )
}
