import node_geocoder from "node-geocoder";
import NodeGeocoder from "node-geocoder";

const options = {
	provider: process.env.GEO_CODER_PROVIDER, //env variable
	apiKey:process.env.GEO_CODER_API_KEY, // for Mapquest env variable
	formatter: null,
	httpAdapter: "https",
};

export const geoCoder = NodeGeocoder(options);
