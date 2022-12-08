import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// For Background trigger using FCM payload
// Error: Failed to find function getBostonWeather in the loaded module
export const onBostonUpdate = functions.firestore
    .document("cities-weather/boston-ma-us")
    .onUpdate((change) => {
      const after = change.after.data();
      const payload = {
        data: {
          temp: String(after.temp),
          conditions: after.conditions,
        },
      };
      return admin.messaging().sendToTopic("weather_boston-ma-us", payload);
    });

// For http triggers
export const getBostonWeather = functions.https.onRequest(
    (request, response) => {
      const promise = admin
          .firestore()
          .doc("cities-weather/boston-ma-us")
          .get();
      const p2 = promise.then((snapshot) => {
        const data = snapshot.data();
        response.send(data);
      });
      p2.catch((error) => {
        console.log(error);
        response.status(500).send(error);
      });
    }
);
