import NodeGeocoder from "node-geocoder";

// Fallback to openstreetmap if provider/api key not set
const provider = process.env.GEO_CODER_PROVIDER || "openstreetmap";
const apiKey = process.env.GEO_CODER_API_KEY || undefined;

const options = {
  provider,
  apiKey,
  formatter: null,
  httpAdapter: "https",
};

export const geoCoder = NodeGeocoder(options);
