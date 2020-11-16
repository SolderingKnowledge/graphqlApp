const graphql = require('graphql');
const _ = require('lodash');    

const {
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLSchema// takes in the root query and returns the graphQL instance
}= graphql;

const users = [//hard coded users
    {id:"23", firstName: "Bill", age:20},
    {id:"24", firstName: "Jake", age:21},
    {id:"25", firstName: "Ben", age:22},
]
const UserType = new GraphQLObjectType({
    name:'User',//always going to string, giving a name
    fields:{
        id:{type:GraphQLString},// type string
        firstName:{type:GraphQLString},// type string
        age:{type:GraphQLInt}// type integer
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        user: {
            type:UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){//most important function(not ever used/notorius, but args been used)
                return _.find(users, {id: args.id});
            }
        }
    }
})

module.exports= new GraphQLSchema({
    query:RootQuery
})