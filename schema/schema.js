const graphql = require('graphql');
// const _ = require('lodash');
const axios = require("axios");


const {
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLSchema// takes in the root query and returns the graphQL instance
}= graphql;

// const users = [//hard coded users
//     {id:"23", firstName: "Bill", age:20},
//     {id:"24", firstName: "Jake", age:21},
//     {id:"25", firstName: "Ben", age:22},
// ]

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: {
        id:{type:GraphQLString},// type string
        name:{type:GraphQLString},// type string
        description:{type:GraphQLString}// type string
    }
})

const UserType = new GraphQLObjectType({
    name:'User',//always going to string, giving a name
    fields: {
        id:{type:GraphQLString},// type string
        firstName:{type:GraphQLString},// type string
        age:{type:GraphQLInt},// type integer
        company: {
            type: CompanyType,
            resolve(parentValue, args){
                console.log(parentValue, args);
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.data);
            }
        }// making connection to company something like foreignKey

    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        user: {
            type:UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){//most important function(not ever used/notorius, but args been used)
                // return _.find(users, {id: args.id});
                return axios.get(`http://localhost:3000/users/${args.id}`).then(res => res.data);//because axios returns {data: {...res}}; in this fashion

            }
        },
        company: { // adding company to allow GraphQL straight to resource without going through middle steps
            type:CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){//most important function(not ever used/notorius, but args been used)
                // return _.find(users, {id: args.id});
                return axios.get(`http://localhost:3000/companies/${args.id}`).then(res => res.data);//because axios returns {data: {...res}}; in this fashion
            }
        },
    }
})

module.exports= new GraphQLSchema({
    query:RootQuery
})