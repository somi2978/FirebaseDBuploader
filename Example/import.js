const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./serviceAccount.json');
const firebaseConfig = require('./config.js');

const jsonToFirestore = async () => {
    try {
        console.log('Initializing Firebase');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: firebaseConfig.databaseURL
        });
        console.log('Firebase Initialized');

        const firestore = admin.firestore();

        console.log('Reading JSON file');
        const jsonData = fs.readFileSync("./Example/Exam.json", 'utf8');  
        const data = JSON.parse(jsonData);

        console.log('Inserting data into Firestore');
        const collectionRef = firestore.collection('Exam'); // 대상 컬렉션의 이름으로 변경

        for (const item of data) {
            await collectionRef.add(item);
        }

        console.log('Data inserted successfully');
    } catch (error) {
        console.log(error);
    }
};

const jsonDelete = async () => {
    try {
        console.log('Initializing Firebase');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: firebaseConfig.databaseURL
        });
        console.log('Firebase Initialized');

        const firestore = admin.firestore();

        console.log('Deleting data into Firestore');
        const collectionRef = firestore.collection('Exam'); // 대상 컬렉션의 이름으로 변경

        const snapshot = await collectionRef.get();
        const deletePromises = [];

        snapshot.forEach((doc) => {
            deletePromises.push(doc.ref.delete());
        });

        await Promise.all(deletePromises);

        console.log('Data deleted successfully');
    } catch (error) {
        console.log(error);
    }    
}

// 둘중 하나만 실행할 것.
jsonToFirestore();  // db json 대용량 입력함수
// jsonDelete();  // db 전체 데이터 삭제 함수
