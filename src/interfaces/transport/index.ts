import {
	GetConnectionParams,
	GetLocationParams,
} from "@/interfaces/transport/types";

// https://transport.opendata.ch/docs.html#locations
async function getLocations(params: GetLocationParams) {}

// https://transport.opendata.ch/docs.html#connections
async function getConnections(params: GetConnectionParams) {}

export { getLocations, getConnections };
