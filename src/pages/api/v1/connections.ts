import { NextApiRequest, NextApiResponse } from "next";
import { getConnections } from "@/interfaces/transport";
import { QueryParam } from "@/types";
import { isNonBlankString, isValidInt } from "@/utils";

function invalidParams(
	from: QueryParam,
	to: QueryParam,
	limit: QueryParam | number,
	page: QueryParam | number,
) {
	const errors = new Map<string, string>();
	if (!isNonBlankString(from)) {
		errors.set("from", "Required `from` must be a non-blank string");
	}

	if (!isNonBlankString(to)) {
		errors.set("to", "Required `to` must be a non-blank string");
	}

	// TODO: validate valid range to limit and page
	if (!isValidInt(limit)) {
		errors.set("limit", "`limit` must be a valid number");
	}

	if (!isValidInt(page)) {
		errors.set("page", "`page` must be a valid number");
	}

	if (errors.size === 0) return;
	return Object.fromEntries(errors);
}

async function getConnectionsHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { from, to, limit = 4, page = 0 } = req.query;
	const validationErrors = invalidParams(from, to, limit, page);

	if (validationErrors) {
		res.status(400);
		res.json(validationErrors);
	} else {
		try {
			const limitNum = parseInt(String(limit));
			const pageNum = parseInt(String(page));

			const apiResponse = await getConnections({
				from: from as string,
				to: to as string,
				limit: limitNum,
				page: pageNum,
			});

			res.status(200);
			res.json(apiResponse.connections);
		} catch (apiError) {
			res.status(500);
			res.json({ error: String(apiError) });
		}
	}
	res.end();
}

export default getConnectionsHandler;
