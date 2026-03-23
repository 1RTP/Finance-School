import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { Event, User, Participant } from "./models.js";

const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type Event {
    id: ID!
    title: String!
    date: String!
    description: String
    creator: User!
    participants: [Participant!]!
  }

  type Participant {
    id: ID!
    fullName: String!
    email: String!
    eventId: ID!
    birthDate: String
    source: String
    createdAt: String
  }

  type Query {
    getEvents(limit: Int, skip: Int, filterByTitle: String): [Event!]!
  }

  input EventInput {
    title: String!
    date: String!
    description: String
  }

  input ParticipantInput {
    fullName: String!
    email: String!
    eventId: ID!
  }

  type Mutation {
    addEvent(input: EventInput!): Event!
    addParticipant(input: ParticipantInput!): Participant!
  }
`;

const resolvers = {
  Query: {
    getEvents: async (_, { limit = 5, skip = 0, filterByTitle }) => {
      const query = filterByTitle ? { title: new RegExp(filterByTitle, "i") } : {};
      return await Event.find(query)
        .skip(skip)
        .limit(limit)
        .populate("creator");
    },
  },
  Mutation: {
    addEvent: async (_, { input }, { req }) => {
      if (!req.session.userId) {
        throw new Error("Необхідна авторизація");
      }
      const event = new Event({
        ...input,
        creator: req.session.userId
      });
      await event.save();
      return await event.populate("creator");
    },
    addParticipant: async (_, { input }, { req }) => {
      if (!req.session.userId) {
        throw new Error("Необхідна авторизація");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) {
        throw new Error("Невірний формат email");
      }

      const participant = new Participant({
        ...input,
        createdAt: new Date()
      });
      await participant.save();
      return participant;
    }
  },
  Event: {
    id: (event) => event._id.toString(),
    participants: async (event) => {
      return await Participant.find({ eventId: event._id });
    }
  },
  User: {
    id: (user) => user._id.toString(),
  },
  Participant: {
    id: (p) => p._id.toString(),
  }
};

export async function initGraphQL(app) {
  const serverApollo = new ApolloServer({ typeDefs, resolvers });
  await serverApollo.start();
  app.use(
    "/graphql",
    bodyParser.json(),
    expressMiddleware(serverApollo, {
      context: async ({ req }) => ({ req })
    })
  );
}
