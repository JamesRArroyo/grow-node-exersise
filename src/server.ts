import * as express from 'express';
import { StarWarsAPI }  from './star-wars/star-wars';

const port = 3000;
const app = express();
const starWarsRoutes = new StarWarsAPI().router;

// Register routes
app.use('/', starWarsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

