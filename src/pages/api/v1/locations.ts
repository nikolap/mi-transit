import { NextApiRequest, NextApiResponse } from "next";
import { getLocations } from "@/interfaces/transport";

type QueryParam = string | string[] | undefined;

function isNonBlankString(s: unknown) {
	return typeof s === "string" && s.trim() !== "";
}

// TODO: can refactor out invalidParams and common error handling code, or use a lib
function invalidParams(query: QueryParam) {
	return !isNonBlankString(query);
}

async function getLocationsHandler(req: NextApiRequest, res: NextApiResponse) {
	const { query } = req.query;
	const validationErrors = invalidParams(query);

	if (validationErrors) {
		res.status(400);
		// TODO: more info here please
		res.json({ error: "true" });
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
