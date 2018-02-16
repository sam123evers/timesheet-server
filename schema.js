const graphql = require('graphql');
const initOptions = {
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};
    
const pgp = require('pg-promise')(initOptions);

const db = pgp('postgresql://samevers:Askol123@localhost:5432/timesheet');

// const query = `SELECT * FROM timedata.entries`;
// db.any(query).then((data) => {
//       console.log(data)
// });



db.connect()
    .then(obj => {
         // console.log(obj);  
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
});


const {
   GraphQLObjectType,
   GraphQLInt,
   GraphQLID,
   GraphQLString,
   GraphQLBoolean,
   GraphQLList,
   GraphQLSchema
} = graphql;

const ProjectType = new GraphQLObjectType({
   name: 'Projects',
   fields: () => ({
      entryId: {type: GraphQLID},
      project_name: { type: GraphQLString },
      resource: { type: GraphQLString },
      activity: { type: GraphQLString },
      taskName: { type: GraphQLString },
      entryDate: { type: GraphQLString },
      stop: { type: GraphQLString },
      start: { type: GraphQLString },
      hoursWorked: { type: GraphQLString },
      hourlyRate: { type: GraphQLString },
      total: { type: GraphQLString },
      
   })
});

// const ResourceType = new GraphQLObjectType({
//       name: 'Resource',
//       fields: () => ({

//       })
// })

const RootQuery = new GraphQLObjectType({
      name: 'RootQueryType',
      fields: () => ({
            projects: {
                  type: new GraphQLList (ProjectType),
                  args: { projectName: { type: GraphQLString } },
                  resolve() {
                        console.log('rootquery resolve');
                        
                        const query = `SELECT * FROM timedata.entries`;
                        return db.many(query)
                              .then(data => {
                        return data;
                        })
                              .catch(err => {
                        return 'The error is', err;
                        });
                  }
            }
      })
});


module.exports = new GraphQLSchema({
   query: RootQuery
});