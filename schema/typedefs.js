const { gql } = require("apollo-server");

const typeDefs = gql`
  type carMake {
    Make_ID: String!
    Make_Name: String!
  }

  type vechiclePerMake {
    VehicleTypeId: [String]
    VehicleTypeName: [String]
  }

  type completeCarData {
    Make_ID: [String]
    Make_Name: [String]
    vehicleTypes: [vechiclePerMake]
  }

  type Query {
    carsMake: [carMake!]!
    getVechiclePerMake: [vechiclePerMake!]!
    getCompleteCarData: [completeCarData]
  }
`;

module.exports = typeDefs;
