import { NextApiRequest, NextApiResponse } from "next";
import { getLocations } from "@/interfaces/transport";
import { QueryParam } from "@/types";
import { isNonBlankString } from "@/utils";

// TODO: can refactor out invalidParams and common error handling code, or use a lib
function invalidParams(query: QueryParam) {
	const errors = new Map<string, string>();
	if (!isNonBlankString(query)) {
		errors.set("query", "Required `query` must be a non-blank string");
	}

	if (errors.size === 0) return;
	return Object.fromEntries(errors);
}

async function getLocationsHandler(req: NextApiRequest, res: NextApiResponse) {
	const { query } = req.query;
	const validationErrors = invalidParams(query);

	if (validationErrors) {
		res.status(400);
		res.json(validationErrors);
	} else {
		try {
			const apiResponse = await getLocations({
				query: query as string,
				type: "all",
			});

			res.status(200);
			res.json(apiResponse.stations);
		} catch (apiError) {
			res.status(500);
			res.json({ error: String(apiError) });
		}
	}
	res.end();
}

export default getLocationsHandler;
