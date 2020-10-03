import NodeGeocoder from "node-geocoder";

const options = {
	provider: process.env.GEO_CODER_PROVIDER, // geoCoder provider (Mapquest)
	apiKey: process.env.GEO_CODER_API_KEY, // Provider API key
	formatter: null,
	httpAdapter: "https",
};

export const geoCoder = NodeGeocoder(options);
