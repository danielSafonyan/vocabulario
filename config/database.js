const mongoose = require('mongoose')

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the DB_STRING in the `.env` file.
 */ 

const mongoUri = process.env.DB_STRING;

const UserSchema = new mongoose.Schema({
    username: String,
    nickname: String,
    email: String,
    hash: String,
    salt: String,
    transLang: String,
    wordList: [{
            baseWord: String,
            wordDefinition: String,
            wordExample: String
        }]
});

// const WordSchema = new mongoose.Schema({
//   baseForm: String,
//   definition: String,
//   example: String,
//   translation: {
//     russian: String,
//     english: String
//   }
// });

connectDB()

const User = mongoose.model('User', UserSchema);
// const Word = mongoose.model('Word', WordSchema);

async function connectDB() {
    try {
        await mongoose.connect(mongoUri, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
         })
        console.log("Connected to DB.")
    } catch (err) {
        console.log(`Not connected to DB. ${err}`)
    }
}
