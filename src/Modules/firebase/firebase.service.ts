import { Injectable } from "@nestjs/common";
import {FirebaseApp, initializeApp} from 'firebase/app'
import {FirebaseStorage, getStorage, listAll, ref, getDownloadURL, uploadBytes, deleteObject} from 'firebase/storage'
import {signInWithEmailAndPassword, getAuth, Auth} from 'firebase/auth'
import { randomUUID } from "crypto";

@Injectable()
export class FirebaseService {
    firebase: FirebaseApp;
    storage: FirebaseStorage;
    auth: Auth;

    constructor() {
        const {
            FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN,
            FIREBASE_PROJECT_ID,
            FIREBASE_STORAGE_BUCKET,
            FIREBASE_MESSAGING_SENDER_ID,
            FIREBASE_APP_ID,
            FIREBASE_MEASUREMENT_ID,
            FIREBASE_USER,
            FIREBASE_USER_PASSWORD
        } = process.env

        this.firebase = initializeApp(
            {
                apiKey: FIREBASE_API_KEY,
                authDomain: FIREBASE_AUTH_DOMAIN,
                projectId: FIREBASE_PROJECT_ID,
                storageBucket: FIREBASE_STORAGE_BUCKET,
                messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
                appId: FIREBASE_APP_ID,
                measurementId: FIREBASE_MEASUREMENT_ID   
            }
        );

        this.auth = getAuth(this.firebase)
        this.storage = getStorage(this.firebase);
        signInWithEmailAndPassword(this.auth, FIREBASE_USER, FIREBASE_USER_PASSWORD);
    }

    async findImages(folder: string) {
        const storageRef = ref(this.storage, folder)
        return await listAll(storageRef).then((res) => {
            return Promise.all(res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef)
                return {
                    name: itemRef.name,
                    url
                }
            }))
        })
    }

    async createImages(images: Array<Express.Multer.File>, folder: string) {
        await Promise.all(images.map(async (image) => {
            const storageRef = ref(this.storage, folder + "/" + randomUUID());
            await uploadBytes(storageRef, image.buffer, {contentType: image.mimetype, contentEncoding: image.encoding})
        }));
        return;
    }

    async deleteImage(id: string, folder: string) {
        const storageRef = ref(this.storage, folder + "/" + id)
        await deleteObject(storageRef);
        return;
    }
}