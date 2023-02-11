import {
	GetConnectionParams,
	GetLocationParams,
} from "@/interfaces/transport/types";
import fetch from "isomorphic-unfetch";
import { Unfetch } from "unfetch";
import Response = Unfetch.Response;

// ---------
// Dev note:
//   The API implemented here is a subset of the full capabilities of the transport.opendata.ch API.
//   It can be extended further as desired and needed. For the purposes of this demo application
//   the simplest path was chosen
// ---------

const rootApiUrl = "http://transport.opendata.ch/v1";

function apiQuery(endpoint: string, params: Record<string, any>) {
	const searchParams = new URLSearchParams(params).toString();
	return `${rootApiUrl}/${endpoint}?${searchParams}`;
}

function handleApiResponse(resp: Response) {
	const status = resp.status;

	if (status === 200) {
		return resp.json();
	}

	throw new Error(`Error with api request, status code: ${status}`);
}

// https://transport.opendata.ch/docs.html#locations
async function getLocations(params: GetLocationParams) {
	const resp = await fetch(apiQuery("locations", params));
	return handleApiResponse(resp);
}

// https://transport.opendata.ch/docs.html#connections
async function getConnections(params: GetConnectionParams) {
	const resp = await fetch(apiQuery("connections", params));
	return handleApiResponse(resp);
}

export { getLocations, getConnections };
