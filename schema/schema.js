//// *** IMPROVED: 1 ***
// const graphql = require('graphql');
// const _ = require('lodash');

// const {
//     GraphQLObjectType, 
//     GraphQLString,
//     GraphQLInt,
//     GraphQLSchema// takes in the root query and returns the graphQL instance
// } = graphql;

// const users = [//hard coded users
//     {id:"23", firstName: "Bill", age:20},
//     {id:"24", firstName: "Jake", age:21},
//     {id:"25", firstName: "Ben", age:22},
// ];

// const UserType = new GraphQLObjectType({
//     name:'User',//always going to string, giving a name
//     fields: {
//         id:{type:GraphQLString},// type string
//         firstName:{type:GraphQLString},// type string
//         age:{type:GraphQLInt}// type integer
//     }
// });

// const RootQuery = new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields:{
//         user: {
//             type: UserType,
//             args: {id: {type: GraphQLString}},
//             resolve(parentValue, args){//most important function(not ever used/notorius, but args been used)
//                 return _.find(users, {id: args.id});
//             }
//         }
//     }
// })

// module.exports= new GraphQLSchema({
//     query:RootQuery
// })



//// *** IMPROVED: 2 ***
const graphql = require('graphql');
const axios = require("axios");


const {
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,// takes in the root query and returns the graphQL instance
    GraphQLList,
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({ // wrapping to function solves circular error where it complains for using before definition; closure!
        id:{type:GraphQLString},// type string
        name:{type:GraphQLString},// type string
        description:{type:GraphQLString},// type string
        users: {
            type: new GraphQLList(UserType),// able to go to users from here; multiple users will be associated to the company
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then( res => {
                    // console.log("res is here", res);
                    return res.data
                });
                // return async () => {
                //     const res = await axios.get(`http://localhost:3000/companies/${parentValue.id}/users`);
                //     console.log("aikol", res);
                //     const json = await res.json();
                //     console.log("json is here", json);
                //     return json.data;
                // }
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name:'User',//always going to string, giving a name
    fields: () => ({
        id:{type:GraphQLString},// type string
        firstName:{type:GraphQLString},// type string
        lastName:{type:GraphQLString},// type string
        age:{type:GraphQLInt},// type integer
        company: {
            type: CompanyType,// able to go to companies from here
            resolve(parentValue, args){
                console.log(parentValue, args);
                // localhost:3000 there is a command `npm run json:server` is the npm package
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.data);
            }
        }// making connection to company something like foreignKey

    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
/*
   {
	    user(id:"10"){
            name,
            age,
            lastName,
        }
    }
    --****--
    {
        "data": {
            "user": {
                "firstName": "Bill",
                "age": 20,
                "lastName": "Gates"
        }
    }
}
    
*/
        user: {
            type:UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){//most important function(not ever used/notorius, but args been used)
                // localhost:3000 there is a command `npm run json:server` is the npm package
                return axios.get(`http://localhost:3000/users/${args.id}`).then(res => res.data);//because axios returns {data: {...res}}; in this fashion

            }
        },
/*
   {
	    company(id:"1"){
            name,
            description,
        }
    }
    --****--
    {
        "data": {
            "company": {
            "name": "Microsoft",
            "description": "Software"
        }
    }
}
    
*/
        company: { // adding company to allow GraphQL straight to resource without going through middle steps
            type:CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){//most important function(not ever used/notorius, but args been used)
                // localhost:3000 there is a command `npm run json:server` is the npm package
                return axios.get(`http://localhost:3000/companies/${args.id}`).then(res => res.data);//because axios returns {data: {...res}}; in this fashion
            }
        },
    }
})

module.exports= new GraphQLSchema({
    query:RootQuery
})