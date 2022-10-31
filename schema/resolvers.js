const { default: axios } = require("axios");
const xml2js = require("xml2js");
const fetch = require("node-fetch");
const carMake = require("../model/carMake");
const throttledQueue = require("throttled-queue");
const completeCars = require("../model/completeCars");

const resolvers = {
  Query: {
    async carsMake() {
      const responseData = await fetch(
        "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML"
      );

      const textData = await responseData.text();
      const parser = new xml2js.Parser({ explicitArray: false });
      const data = parser.parseStringPromise(textData).then((result) => {
        const parseData = result.Response.Results.AllVehicleMakes;

        carMake.insertMany(parseData);
        return parseData;
      });

      return data;
    },

    async getVechiclePerMake() {
      const responseData = await fetch(
        "https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/8011?format=xml"
      );
      const textData = await responseData.text();
      const parser = new xml2js.Parser();

      const data = parser
        .parseStringPromise(textData)
        .then((result) => {
          const parseData = result.Response.Results[0].VehicleTypesForMakeIds;

          return parseData ? parseData : [];
        })
        .catch((err) => {
          console.log(err);
        });

      return data;
    },

    async getCompleteCarData() {
      try {
        const throttle = throttledQueue(1, 1000);

        const carsMakeData = await carMake.find();

        let completeCarData = [];

        const cars = await Promise.all(
          carsMakeData.map((car) =>
            throttle(async () => {
              const vechiclePerMake = await fetch(
                `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${car.Make_ID}?format=xml`
              );

              const textData = await vechiclePerMake.text();

              const parser = new xml2js.Parser();

              const parsedData = await parser.parseStringPromise(textData);

              const carCompleteData =
                parsedData.Response.Results[0].VehicleTypesForMakeIds;

              const carData = {
                Make_ID: [car.Make_ID],
                Make_Name: [car.Make_Name],
                vehicleTypes: carCompleteData ? carCompleteData : [],
              };
              completeCarData.push(carData);

              const inserCar = new completeCars(carData);
              await inserCar.save();
              return carData;
            })
          )
        );

        return completeCarData;
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = resolvers;
