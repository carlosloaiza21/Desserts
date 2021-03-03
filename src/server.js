const {ApolloServer, gql } = require('apollo-server');

const initialData=[
    {
        id:"1",
        dessert: "Oreo1",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    },
    {
        id:"2",
        dessert: "Oreo2",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    },
    {
        id:"3",
        dessert: "Oreo3",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    },
    {
        id:"4",
        dessert: "Oreo4",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    },
    {
        id:"5",
        dessert: "Oreo5",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    }
]

let data = [
    {
        id:"1",
        dessert: "Oreo5",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    },
    {
        id:"2",
        dessert: "Oreo6",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    },
    {
        id:"3",
        dessert: "Ore7",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    },
    {
        id:"4",
        dessert: "Oreo8",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    },
    {
        id:"5",
        dessert: "Oreo9",
        calories: 437,
        fat: 18,
        carb: 63,
        protein: 4, 
    }
]

const typeDefs = gql`
    type Dessert {
        id: ID!
        dessert: String
        calories: Int
        fat: Int
        carb: Int
        protein: Int
    }
    
    type Query {
        Desserts: [Dessert]
    }
    type Mutation {
        addDessert(dessert:String!,calories:Int!, fat:Int!, protein:Int!, carb:Int!):Dessert
        reset:[Dessert]
        delete(id:String!):String
    }
`;

const resolvers = {
    Query: {
        Desserts: () => data,
    },
    Mutation: {
        addDessert: (parent,args) =>{
            const item={
                id: Math.random().toString(),
                dessert:args.dessert,
                calories:args.calories,
                fat:args.fat,
                carb:args.carb,
                protein:args.protein 
            }
            data=[
                ...data,
                item
            ]
            return item
        },
        delete:(parent, args)=>{
            const filrered=data.filter((item)=>{
                return item.id !==args.id
            })
            console.log(filrered)
            data=filrered;
            return "deleted"
        },
        reset:()=>{
            data=initialData
            return data
        }    
    }
  };

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});