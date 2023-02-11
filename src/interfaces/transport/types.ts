type LocationQueryType = "all" | "station" | "pol" | "address";

// Subset of https://transport.opendata.ch/docs.html#locations
interface GetLocationParams {
	query: string;
	type: LocationQueryType;
}

// Subset of https://transport.opendata.ch/docs.html#connections
interface GetConnectionParams {
	from: string;
	to: string;
	limit?: number;
	page?: number;
}

export type { GetLocationParams, GetConnectionParams };
