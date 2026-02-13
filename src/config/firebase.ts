import admin from "firebase-admin";
import serviceAccount from "./truevalue-24b6a-firebase-adminsdk-fbsvc-55eb2cbbb1.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
