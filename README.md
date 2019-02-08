# Grow-Node-Exercise
My Implementation of Grow's Node Challenge. 

## Usage

```
npm install
npm start
```

## API Endpoints

```
GET /people
GET /people?sortBy=name
GET /people?sortBy=mass
GET /people?sortBy=height
GET /planets
```

| Attribute     | Type          | Required | Description                                                |
|:------------- |:------------- |:-------- |:---------------------------------------------------------- |
| sortBy        | string        | no       | Sorts all people asscending by 'name', 'mass' or 'height'. |
