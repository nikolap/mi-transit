import { NextApiRequest, NextApiResponse } from "next";

async function getConnectionsHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	res.end;
}

export default getConnectionsHandler;
