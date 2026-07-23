import { initializeApp, cert, getApps, ServiceAccount } from "firebase-admin/app";
import serviceAccount from "./firebase-admin.json";

const apps = getApps();

const firebaseApp = apps.length
  ? apps[0]
  : initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });

export default firebaseApp;