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
    eventsCursor(limit: Int, after: ID): [Event!]!
    event(id: ID!): Event
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
    updateEvent(id: ID!, input: EventInput!): Event!
    deleteEvent(id: ID!): Boolean!
    addParticipant(input: ParticipantInput!): Participant!
    deleteParticipant(id: ID!): Boolean!
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
    eventsCursor: async (_, { limit = 5, after }) => {
      const query = after ? { _id: { $gt: after } } : {};
      return await Event.find(query).sort({ _id: 1 }).limit(limit).populate("creator");
    },
    event: async (_, { id }) => {
      return await Event.findById(id).populate("creator");
    }
  },
  Mutation: {
    addEvent: async (_, { input }, { req }) => {
      if (!req.session.userId) throw new Error("Необхідна авторизація");
      const event = new Event({
        ...input,
        creator: req.session.userId
      });
      await event.save();
      return await event.populate("creator");
    },
    addParticipant: async (_, { input }, { req }) => {
      if (!req.session.userId) throw new Error("Необхідна авторизація");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) throw new Error("Невірний формат email");
      const participant = new Participant({
        ...input,
        createdAt: new Date()
      });
      await participant.save();
      return participant;
    },
    updateEvent: async (_, { id, input }, { req }) => {
      if (!req.session.userId) throw new Error("Необхідна авторизація");
      const event = await Event.findById(id);
      if (!event) throw new Error("Подію не знайдено");
      if (event.creator.toString() !== req.session.userId) throw new Error("Ви можете редагувати тільки свої події");
      Object.assign(event, input);
      await event.save();
      return event;
    },
    deleteEvent: async (_, { id }, { req }) => {
      if (!req.session.userId) throw new Error("Необхідна авторизація");
      const event = await Event.findById(id);
      if (!event) throw new Error("Подію не знайдено");
      if (req.session.role !== "Admin" && event.creator.toString() !== req.session.userId) throw new Error("Ви можете видаляти тільки свої події");
      await event.deleteOne();
      return true;
    },
    deleteParticipant: async (_, { id }, { req }) => {
      if (!req.session.userId) throw new Error("Необхідна авторизація");
      const participant = await Participant.findById(id);
      if (!participant) throw new Error("Учасника не знайдено");
      await participant.deleteOne();
      return true;
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
