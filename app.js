const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            console.log('sgfghfda');
            const nowString = new Date().toISOString();
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(nowString)
            })
            return event
                .save()
                .then((result)=>{
                    console.log('sgfghfda2');
                    console.log(result);
                    return {...result._doc};
                }).catch((err => {
                    console.log(err);
                    throw err;
                })
            );
        }
    },
    graphiql: true
}))

console.log(`mongodb+srv://${process.env.MONGO_USER}:<${process.env.MONGO_PASSWORD}>@cluster0-gdutn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`);

mongoose.connect(`mongodb+srv://cluster0-gdutn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,{
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD
}).then(()=>{
    const port = 3000;
    console.log(`listen port ${port}`);
    app.listen(port);
}).catch(err => {
    console.log(err);
})