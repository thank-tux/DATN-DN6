import {
  createUserWithEmailAndPassword as createUserWithEmailAndPasswordFirebase,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  signOut as signOutFirebase,
  signInWithPopup,
  GoogleAuthProvider,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const googleAuth = new GoogleAuthProvider();
const currentAuth = auth.currentUser;

export async function ChangePassword(uid, newPassword) {
  const docRef = doc(db, "users", uid);
  try {
    await updatePassword(currentAuth, newPassword);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        ["password"]: newPassword,
      });
    }
  } catch (e) {}
}

export async function updateProfileUser(name) {
  await updateProfile(currentAuth, { displayName: name });
}

export async function signUpWithEmailAndPassword(email, password) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPasswordFirebase(
      auth,
      email,
      password
    );
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signInWithEmailAndPassword(email, password) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPasswordFirebase(auth, email, password);
  } catch (e) {
    error = e;
  }
  return { result, error };
}

export async function signOut() {
  let result = null;
  let error = null;
  try {
    result = await signOutFirebase(auth);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
export async function signInGoogle() {
  let result = null,
    error = null;
  try {
    result = await signInWithPopup(auth, googleAuth);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export const UpLoadFile = async (img) => {
  let urlDownload,
    upload = null;

  if (img) {
    const name = img.name;
    const storageRef = ref(storage, `image/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        upload = progress;
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.error(error);
      },
      async () => {
        urlDownload = await getDownloadURL(uploadTask.snapshot.ref);
      }
    );
  } else {
    console.error("File not found");
  }

  while (!urlDownload) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { urlDownload, upload };
};
export const getData = async (name) => {
  let newData;
  await getDocs(collection(db, name)).then((querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    newData = data;
  });
  return newData;
};

export const addData = async (name, data) => {
  try {
    await addDoc(collection(db, name), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
export const addDataWithID = async (name, id, data) => {
  try {
    await setDoc(doc(db, name, id), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const deleData = async (name, id) => {
  try {
    const docRef = doc(db, name, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.log(error);
  }
};
export const updateData = async (name, id, newData) => {
  try {
    const docRef = doc(db, name, id);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.log(error);
  }
};
export const getItem = async (name, id) => {
  try {
    const docRef = doc(db, name, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.log("hehe", error);
  }
};
export const deleteElementArray = async (name, uid, id, nameArray) => {
  const docRef = doc(db, name, uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const newArray = data[nameArray].filter((obj) => obj.id !== id);

    await updateDoc(docRef, {
      [nameArray]: newArray,
    });
  }
};
