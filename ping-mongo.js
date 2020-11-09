const mongoose = require('mongoose');

async function bootstrap() {
  const MONGO_DB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0aypw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

  try {
    const m = await mongoose.connect(MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    m.disconnect();
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
